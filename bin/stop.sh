#!/bin/bash

set -x

process=/data/opt/experience/core/run.py

pid=$(ps x | grep $process | grep -v grep | awk '{print $1}')

echo "${process} process id is : ${pid}"

if ps -p $pid > /dev/null
then
   echo "${pid} is running,now kill the process!"
   kill $pid
fi

