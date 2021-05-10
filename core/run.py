#!/usr/bin/env python3
# -*- coding: utf-8 -*
# @Time : 2021/5/8 11:31 上午
# @Author : lijunhua
# @Email : 634134551@qq.com
# @File : run.py

from flask import Flask, render_template
import sys
import os
curPath = os.path.abspath(os.path.dirname(__file__))
rootPath = os.path.split(curPath)[0]
sys.path.append(rootPath)



app = Flask(__name__, template_folder='templates/', static_folder='templates/static')
app.config['JSON_SORT_KEYS'] = False

@app.route('/')
def userManagement():
    return render_template('get_show.html')


if __name__ == '__main__':
    print("start!")

    # Blueprints
    from core.main.utils.common import common
    app.register_blueprint(common, url_prefix='/api/v1')

    from core.main.dataManagement.get_data import get_data
    app.register_blueprint(get_data, url_prefix='/api/v1')

    app.run(host="0.0.0.0", port=6666, debug=True)
    print("running!")