#!/bin/bash

echo "AWS Configuration started"

awslocal s3api create-bucket --bucket prospects-files

awslocal s3api put-bucket-cors --bucket prospects-files \
    --cors-configuration \
    "{
        \"CORSRules\": [
            {
            \"AllowedHeaders\": [\"*\"],
            \"AllowedMethods\": [\"GET\", \"POST\", \"PUT\", \"HEAD\", \"DELETE\"],
            \"AllowedOrigins\": [
                \"http://localhost:3000\",
                \"https://app.localstack.cloud\",
                \"http://app.localstack.cloud\"
            ],
            \"ExposeHeaders\": [\"ETag\"]
            }
        ]
    }"
awslocal s3api get-bucket-cors --bucket prospects-files

echo "AWS Configuration completed"