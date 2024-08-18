#!/usr/bin/sh

export $(grep "MONGO_PORT" .env | xargs)
export $(grep "REDIS_PORT" .env | xargs)

docker run -d --name sinova-redis -p $REDIS_PORT:6379 redis/redis-stack-server:latest
docker run -d --name sinova-mongo -p $MONGO_PORT:27017 mongo:latest
npm run start:dev
