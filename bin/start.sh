#!/bin/bash

set -x

process=/data/opt/experience/core/run.py
pid=$(ps x | grep $process | grep -v grep | awk '{print $1}')
if ps -p $pid > /dev/null
then
   echo "${pid} is running,please run stop.sh first!"
   exit 0
fi


source /etc/profile

CURR_DIR=`dirname "$0"`
CURR_DIR=`cd "$CURR_DIR";pwd`

export PYTHONPATH=${CURR_DIR}/..
cd ${CURR_DIR}/../core
nohup python3 run.py &