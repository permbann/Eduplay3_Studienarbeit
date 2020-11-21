#!/bin/bash
docker build -t jnl .
docker run -p 5000:5000 -d jnl
google-chrome http://localhost:5000/