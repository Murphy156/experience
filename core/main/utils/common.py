# noinspection PyUnresolvedReferences
from flask import Flask, request,jsonify
# noinspection PyUnresolvedReferences
from flask import Blueprint,views
from flask_restful import Resource, Api
# noinspection PyUnresolvedReferences
import xlrd
from core.main.utils.db.db_helper import *
import logging.config
import yaml
import os

logging.config.fileConfig("../conf/logging.conf", disable_existing_loggers=False)
LOG = logging.getLogger(name="rotatingFileLogger")

common = Blueprint('common', __name__)
api = Api(common)

class Common(Resource):

    # 构造函数
    def __init__(self):
        conf = yaml.load(open('../conf/config.yaml', encoding='UTF-8'), Loader=yaml.FullLoader)
        self._conf = conf
        self.db = DbObject(self._conf['db_conf'])

    def get(self,operation):
        pass

    def post(self,operation):
        pass







api.add_resource(Common, '/common/<operation>')