# Description

SINOVA <a href="https://docs.google.com/document/d/1c39vzhs7fJtoeJLN7nLjZozOl_fCnQeRd3-O1Z3UAIA/edit#heading=h.6b2ayq5yibqs">Backend Test Assignment</a>. Feel free to change `.env` file.

This NestJS backend application introduces link shortening functionality. **MongoDB** is used for persistent data storage, **Redis** for cache and rate limiting.
You should also have **Docker** installed.

## Installation

```bash
npm ci
```

## Running the app

There are 2 ways to run the app:

_1-st variant_:

```bash
# This script will start Docker containers for Redis and MongoDB, and start the app in watch mode
./run_backend.sh
```

_2-nd variant_:

```bash
docker run -d --name sinova-redis -p YOUR_REDIS_PORT:6379 redis/redis-stack-server:latest
docker run -d --name sinova-mongo -p YOUR_MONGO_PORT:27017 mongo:latest

# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test
```

The local backend is at http://localhost:4000 (4000 port by default). You can also access the documentation of this API at http://localhost:4000/api.
