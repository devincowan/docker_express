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
2. So this project uses `docker run`. The "second tier" of Docker capability is using Docker Hub. Think of it like Github but for Docker images instead of code repositories. This allows you to get the built image direct from https://hub.docker.com/repository/docker/dcquickdraw/express_docker. So this negates the step of cloning the git repo. In this case, all you have to do is:
```
docker pull dcquickdraw/express_docker
docker run -p 8080:80 -v ${PWD}:/app --name express_docker_container dcquickdraw/express_docker
```
3. [Learn about DOCKER-COMPOSE](https://blog.thenextgenlearn.com/2021/02/08/docker-compose-with-nodejs-express-and-postgresql/). Docker-compose allows you to connect multiple services/containers. You can add networks, volumes, etc.

## How this project works (to the best of my knowledge as a beginner with Docker)
* When you call `docker run...`,  docker looks for a default Docker build file which it finds at ./[Dockerfile](https://github.com/devincowan/docker_express/blob/master/Dockerfile)
* The dockerfile first pulls the [most recent image for node from docker hub](https://hub.docker.com/_/node/) with `FROM node:latest`
* Then is moves into /app and copies all of the files from your host computer current directory, into the docker container's /app directory
* Then it runs `npm install`
* Exposes port 80 so that we can connect to it from our host computer
* Tells docker where it should start using `ENTRYPOINT ["node", "index.js"]`

## Why is Docker cool?
So why not just run Express on my development computer? It would be way easier right? Well yes, it would.
But did you notice that by clearly defining every step to build the Docker Container in the [Dockerfile](https://github.com/devincowan/docker_express/blob/master/Dockerfile), we ensure that every single instance of this project will be running on the same environment.
So for this project it doesn't really matter. But what if I had a project with all sorts of backend requirements? I run into this a lot with PHP projects that do all sorts of non-traditional server-side tasks. They might require all sorts of special php modules and apache configurations and mysql tweaks. All of these intricate details could be spelled out in the Dockerfile and then anyone on any system that runs docker could then simply pull my dockerfile and do `docker run...` and it would build the exact backend environment that I had.

So most hosting companies cover your ass. The good ones try to configure your host in anticipation of your needs so if you're spinning off simple Wordpress sites, the host will already have the PHP mods and Mysql config and Apache or Nginx for you. But if you needed to deploy your app somewhere particular you might want to know that the env was exactly the same build. Or if you work on a team with more than 1 person and you want to share your project across differnt dev computers that are all different hardware and os and different versions of Python and PHP and node and etc etc.... Docker can be used as a fast way to ensure that you're all running on the same foundation.

## Other examples that hilight Docker's utility
### Mysql container
Let's say you have an old project that needs a specific version of mysql for some reason. You need to do some dev work on this project. But when you start your dev server, it just spits mysql errors because your dev computer is now running a different version of mysql. You could of course go through the massive pain of uninstalling your current version, and installing the old version, doing the dev work, uninstalling the old version, and reinstalling the new version of mysql. But that's freaking ridiculous. Instead, let's just build a docker container that can run at the same time as your current version of mysql on your dev computer.
* mysql version 8.0.11
* let's even say we had to specify an different version of collation for the server)
* let's make root password = root
```
docker run -p 3306:3306 --name docker-mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:8.0.11 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
```
Boom. You run this docker image and get to use the specific 8.0.11 version of mysql without actually changing anything on your dev rig. When you're done with the work, you scrap the docker container (or just turn it off so that next time you can just boot it back up) and nothing has been changed on your actuall dev system.

### LAMP
Let's say you have a PHP project that you developed last year. At the time, you were using php 5.6
Now you want to update the project to a new framework, but you see that framework requires php v7.3
Let's say you run this project on a CDN to get global coverage because you have a big customer base in Australia. So you have like 5 servers let's say.

If you built and deployed the project with Docker, all you would have to do is open the dockerfile, declare an update php version, and push that new dockerfile to github and/or dockerhub and tell all of your colaborators acrost the globe that they should bull your latest image (or, if you're cool enough, they already have a CI pipline and hooks so that it just happens automatically). So it takes like maybe 10min for you to do this update.

If YOU DIDN'T BUILD WITH DOCKER, you are in a bad situation. First, you have to update php manually on your development/staging servers so that you can test things. And if you're working with any other developers on this project, they have to rebuild their PHP dependencies on thier dev computers as well. Then, once you've done your testing etc, you have to call up all 5 of your production locations and tell them to get a sys admin in there to upgrade php to 7.3. And you have to budget for $100+ per hour for that time while they dink around trying to get the correct privileges so that they can install all the new versions of phpmodules. Not cool.

Here's a 1 liner to build a quick LAMP on your system:
```
docker run --rm -p 80:80 -v ${PWD}:/var/www/html --name lamp fauria/lamp
```
And to get "into" the container you would do `docker exec -it lamp /bin/bash`

### Different linux distro
Let's say you're running Centos. You like to mount an smb share to colaborate with your friends. One of them runs debian and she calls you and says that she's not able to mount the shared volume on her computer. You want to troubleshoot and you suspect that it's the OS.

So if you didn't know Docker, you could use VirtualBox or similar to get a VM and install debian on it. Or you could install debian on a partition and conifure it to paralell boot with your Centos. Or you could find an old computer and install debian on that, all just so you could test the mount on a debian computer. But that all sucks.

With docker you could do
```
docker run \
-ti debian bash
```
This pulls the [latest debian image](https://hub.docker.com/_/debian/) from docker hub and "enters into it" by opening a bash shell. Boom. You have a debian "machine" that you can use to test the mount. SIMPLE.
