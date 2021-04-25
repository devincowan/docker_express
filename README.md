# docker_express
An example of using Docker containers for Express development

## Install
1. You need Docker Desktop installed on your computer
2. `git clone https://github.com/devincowan/docker_express`
3. `cd docker_express`
4. `docker run -p 8080:80 -v ${PWD}:/app --name express_docker_container dcquickdraw/express_docker`
5. Open a browswer to localhost:8080

## Recommended reading
1. [Steps to build this project](https://faun.pub/step-by-step-guide-to-dockerize-a-node-js-express-application-cb6be4159cf1)
2. [Learn about DOCKER-COMPOSE](https://blog.thenextgenlearn.com/2021/02/08/docker-compose-with-nodejs-express-and-postgresql/)
