#!/bin/bash

curl http://localhost:3000

if [ $? -eq 0 ]
then
    echo "Application is running"
else
    echo "Application failed"
    exit 1
fi
