#!/bin/bash
# Tăng số phiên bản để điện thoại tải bản mới ngay: ./bump.sh
set -e
cd "$(dirname "$0")"
old=$(grep -o 'app.js?v=[0-9]*' index.html | grep -o '[0-9]*$'); new=$((old + 1))
sed -i '' "s/?v=$old/?v=$new/g" index.html app.js sw.js
sed -i '' "s/beangi-v$old/beangi-v$new/" sw.js
echo "Phiên bản $old → $new"
