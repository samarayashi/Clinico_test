#!/bin/bash
docker build -t samarayashi/policyholders-api:latest .
docker push samarayashi/policyholders-api:latest

docker buildx build --platform linux/amd64 -t samarayashi/policyholders-api:amd64 .
docker push samarayashi/policyholders-api:amd64
