#!/usr/bin/bash

docker build . -f ./docker/lib/Dockerfile --output type=local,dest=./
