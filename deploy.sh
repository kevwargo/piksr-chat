#!/bin/sh

set -e

cd "$(dirname "$(dirname "$0")")"

while [ $# -gt 0 ]; do
    case "$1" in
        "static")
            for file in "index.html" "api.js" "style.css" "channels.js" "index.js"; do
                aws s3 cp "$file" s3://piksr-chat/"$file" --acl public-read
            done
            ;;
        "index.html"|"api.js"|"style.css"|"channels.js"|"index.js")
            aws s3 cp "$1" s3://piksr-chat/"$1" --acl public-read
            ;;
        "lambda")
            rm -f lambda.zip && zip lambda.zip lambda.py
            aws lambda update-function-code --function-name kev_func_2 --zip-file fileb://./lambda.zip
            ;;
    esac
    shift
done
