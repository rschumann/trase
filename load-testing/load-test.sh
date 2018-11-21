#!/bin/bash

# siege -c 20 -t 5M -d 5 -i -f apache-urls.txt
# siege -c 30 -t 5M -d 5 -i -f apache-urls.txt
# siege -c 20 -t 1M -d 5 -i -f apache-download-urls.txt

# siege -c 20 -t 5M -d 5 -i -f server-urls.txt
# siege -c 30 -t 5M -d 5 -i -f server-urls.txt
# siege -c 40 -t 5M -d 5 -i -f server-urls.txt
siege -c 20 -t 2M -d 5 -i -f server-download-urls.txt

# siege -c 50 -t 5M -d 5 -i -f test-endpoint.txt
