#!/usr/bin/env python3
# -*- coding: utf-8 -*
# @Time : 2021/5/8 21:41 上午
# @Author : lijunhua
# @Email : 634134551@qq.com
# @File : get_data.py


# noinspection PyUnresolvedReferences
from flask import Flask, request, jsonify, send_file
from flask import Blueprint
from flask_restful import Resource, Api
# noinspection PyUnresolvedReferences
import json
from core.main.utils.db.db_helper import *
from core.main.utils.common import Common
import logging.config
# noinspection PyUnresolvedReferences
from django.shortcuts import render
# noinspection PyUnresolvedReferences
from openpyxl import load_workbook

logging.config.fileConfig("../conf/logging.conf")
LOG = logging.getLogger(name="rotatingFileLogger")

get_data = Blueprint('GETDATA', __name__)
api = Api(get_data)

import time, datetime
today = datetime.date.today()
tomorrow = today + datetime.timedelta(days=1)
after_tomorrow = today + datetime.timedelta(days=2)

USREINFO_HEADER = {
    'id': '序号',
    'name':'姓名',
    'order_day':'预约日期',
    'order_time':'预约时间'
}


class GETDATA(Resource):

    def __init__(self):
        # 实例化Common类
        self._common = Common()

    def get(self, operation):
        if (operation == 'getdate'):
            return self.getdate()
        elif (operation == 'addData'):
            return self.addData()
        elif (operation == 'deleteData'):
            return self.deleteData()
        elif (operation == 'getUserInfo'):
            return self.getUserInfo()
        elif (operation == 'currentShowUser'):
            return self.currentShowUser()

    def post(self, operation):
        if (operation == 'getdate'):
            return self.getdate()
        elif (operation == 'addData'):
            return self.addData()
        elif (operation == 'deleteData'):
            return self.deleteData()
        elif (operation == 'getUserInfo'):
            return self.getUserInfo()
        elif (operation == 'currentShowUser'):
            return self.currentShowUser()



    def getdate(self):
        today = datetime.date.today()
        tomorrow = today + datetime.timedelta(days=1)
        after_tomorrow = today + datetime.timedelta(days=2)
        a = str(today)
        b = str(tomorrow)
        c = str(after_tomorrow)
        date =[a, b, c]
        print(date)
        return jsonify(date)

    def addData(self):
        # 获取post的传输数据，并使用utf-8编码为字符串
        requestData = request.data.decode("utf-8")
        # 对jason字符串格式数据，解析为dict格式
        reqDataDict = json.loads(requestData)
        data = []
        for item in reqDataDict.keys():
            data.append(reqDataDict[item])
        sql = 'INSERT INTO order_list(name,order_day,order_time) VALUE (%s,%s,%s)'
        LOG.info(f"sql is : {sql}")
        res = self._common.db.execute(sql, data)
        LOG.info("sql result is : " + str(res))

    def deleteData(self):
        requestData = request.data.decode("utf-8")
        # 对jason字符串格式数据，解析为dict格式
        reqDataDict = json.loads(requestData)
        print(reqDataDict)
        id = []
        for item in reqDataDict.keys():
            id.append(reqDataDict[item])
        id1 = ''.join(id)
        print(id1)
        sql = f"DELETE FROM order_list WHERE id = '{id1}'"
        LOG.info(f"sql is : {sql}")
        res = self._common.db.execute(sql)
        LOG.info("sql result is : " + str(res))

    def getUserInfo(self):
        today1 = str(today)
        tomorrow1 = str(tomorrow)
        after_tomorrow1 = str(after_tomorrow)
        sql = f"select * from order_list where order_day='{today1}' or order_day='{tomorrow1}' or order_day='{after_tomorrow1}'"
        LOG.info(f"sql is : {sql}")
        res = self._common.db.execute(sql)
        LOG.info("sql result is : " + str(res))
        outputData = self.formatUserInfoOutput(res)
        return jsonify(outputData)

    def formatUserInfoOutput(self, userInfo):
        rows = []
        #
        for user in userInfo:
            user['id'] = str(user['id'])
            row = {}
            for key, value in USREINFO_HEADER.items():
                row[key] = user[key]
            rows.append(row)
        #
        outputData = {
            'header': USREINFO_HEADER,
            'body': rows
        }
        return outputData

    def currentShowUser(self):
        today1 = str(today)
        tomorrow1 = str(tomorrow)
        after_tomorrow1 = str(after_tomorrow)
        sql = f"select * from order_list where order_day='{today1}' or order_day='{tomorrow1}' or order_day='{after_tomorrow1}'"
        LOG.info(f"sql is : {sql}")
        res = self._common.db.execute(sql)
        LOG.info("sql result is : " + str(res))
        for index in range(len(res)):
            res[index].pop('id')
        return jsonify(res)


    # 用于检测不能同一天预约两个时间段
    def one_day_double_check(self):
        pass

    def same_check(self):
        pass
api.add_resource(GETDATA, '/get_data/<operation>')