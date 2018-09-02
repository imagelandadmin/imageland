#!/bin/bash

aws s3 cp ./dist/ui s3://dev.imageland.us --recursive --acl public-read
