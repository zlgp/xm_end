#!/bin/sh
cd D:/htd/xm_end/logs
cp access.log  $(date +%Y-%m-%d).access.log
echo "" > access.log