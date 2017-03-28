#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run -it --rm --name aclu-map-nginx -p 8080:80 -v $DIR/../dist:/usr/share/nginx/html:ro nginx
