#!/bin/bash
VERSION=${1:-latest}
docker build -t samarayashi/policyholders-api:$VERSION .