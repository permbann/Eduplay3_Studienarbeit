#!/bin/bash
docker build -t eduplay-container .
docker run -p 5000:5000 -d eduplay-container