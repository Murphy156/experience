#!/usr/bin/env python3
# -*- coding: utf-8 -*

# noinspection PyUnresolvedReferences
import sys
# noinspection PyUnresolvedReferences
import os
import time
# noinspection PyUnresolvedReferences
import datetime
import traceback
import pymysql
import logging
# noinspection PyUnresolvedReferences
import xlrd
LOG = logging.getLogger(name="rotatingFileLogger")

#
CURSOR_MODE = 0
DICTCURSOR_MODE = 1
SSCURSOR_MODE = 2
SSDICTCURSOR_MODE = 3

FETCH_ONE = 0
FETCH_MANY = 1
FETCH_ALL = 2


class DbObject(object):
    def __init__(self, dbconfig):
        self._dbconninterval = 30
        self._dbconfig = dbconfig
        self._dblastconntime = 0
        self._dbconn = None
        self._dbcursor = None
        self.conndb()
    #
    def conndb(self):
        try:
            self._dbconn = pymysql.connect(host=self._dbconfig['host'], user=self._dbconfig['user'], password=self._dbconfig['password'], \
                                           db=self._dbconfig['dbname'], port=self._dbconfig['port'], charset="utf8", autocommit=True)
            self._dblastconntime = time.time()
        except Exception as err:
            LOG.error(traceback.format_exc())
            raise err
    #
    def reconndb(self):
        try:
            if time.time() > self._dblastconntime + self._dbconninterval:
                self._dblastconntime  = time.time()
                self.closedb()
                self.conndb()
            else:
                time.sleep(1)
        except Exception as err:
            LOG.error(traceback.format_exc())

    def closedb(self):
        try:
            if self._dbconn:
                self._dbconn.close()
            if self._dbcursor:
                self._dbcursor.close()
        except Exception as err:
            LOG.error(traceback.format_exc())

    def __del__(self):
        self.closedb()

    def execute(self, sqltext, args=None, mode=DICTCURSOR_MODE, many=False):
        """
        作用：使用游标（cursor）的execute 执行query
        参数：sqltext： 表示sql语句
             args： sqltext的参数
             mode：以何种方式返回数据集
                CURSOR_MODE = 0 ：store_result , tuple
                DICTCURSOR_MODE = 1 ： store_result , dict
                SSCURSOR_MODE = 2 : use_result , tuple
                SSDICTCURSOR_MODE = 3 : use_result , dict
             many：是否执行多行操作（executemany）
        返回：影响行数（int）
        """
        if mode == CURSOR_MODE:
            curclass = pymysql.cursors.Cursor
        elif mode == DICTCURSOR_MODE:
            curclass = pymysql.cursors.DictCursor
        elif mode == SSCURSOR_MODE:
            curclass = pymysql.cursors.SSCursor
        else:
            curclass = pymysql.cursors.SSDictCursor

        if self._dbcursor:
            self._dbcursor.close()

        self._dbcursor = self._dbconn.cursor(cursor=curclass)
        line = 0
        try:
            if many is False:
                if args is None:
                    line = self._dbcursor.execute(sqltext)
                else:
                    line = self._dbcursor.execute(sqltext, args)
            else:
                if args is None:
                    line = self._dbcursor.executemany(sqltext)
                else:
                    line = self._dbcursor.executemany(sqltext, args)
        except Exception as err:
            LOG.error(f"execute sql failed,the sql is : {sqltext}", err)
            # 重连DB
            self.reconndb()
            # 再次执行sql
            if many is False:
                if args is None:
                    line = self._dbcursor.execute(sqltext)
                else:
                    line = self._dbcursor.execute(sqltext, args)
            else:
                if args is None:
                    line = self._dbcursor.executemany(sqltext)
                else:
                    line = self._dbcursor.executemany(sqltext, args)
        res = self.fetch()
        return res

    def fetch(self, mode=FETCH_MANY, rows=1000):
        """
             mode：执行提
              FETCH_ONE: 提取一个； FETCH_MANY :提取rows个 ；FETCH_ALL : 提取所有
             rows：提取行数
        返回：fetch数据
        """
        if self._dbcursor is None:
            return
        if mode == FETCH_ONE:
            data = self._dbcursor.fetchone()
        elif mode == FETCH_MANY:
            data = self._dbcursor.fetchmany(rows)
        elif mode == FETCH_ALL:
            data = self._dbcursor.fetchall()

        self._dbcursor.close()

        return data

# 写的这些类可以通用吗