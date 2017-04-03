#!/usr/bin/env bash

#This script uses Docker to download and fire up a quick nginx instance against
#this projects dist folder. This can be helpful for testing production builds
#of the site.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Running Nginx Server on port 8080"
docker run -it --rm --name aclu-map-nginx -p 8080:80 -v $DIR/../dist:/usr/share/nginx/html:ro nginx
