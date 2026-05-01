# DSO101 Notes

---

# Unit 1: Introduction to Docker

## What is Docker?

Docker is a platform used to develop, ship, and run applications inside containers. Containers package an application with all its dependencies, ensuring consistency across environments.

---

## Why Use Docker?

* Eliminates "works on my machine" problem
* Lightweight compared to virtual machines
* Faster deployment
* Easy scalability

---

## Docker vs Virtual Machines

| Feature     | Docker (Containers) | Virtual Machines |
| ----------- | ------------------- | ---------------- |
| Size        | Lightweight         | Heavy            |
| Boot Time   | Seconds             | Minutes          |
| Performance | Near-native         | Slower           |
| Isolation   | Process-level       | Full OS          |

---

## Docker Architecture

* **Docker Client** – Command line interface
* **Docker Daemon** – Runs containers
* **Docker Images** – Blueprints for containers
* **Docker Containers** – Running instances of images

---

## Basic Commands

```bash id="u1cmds"
docker --version
docker info
docker help
```

---

# Unit 2: Docker Images and Containers

## Docker Images

Images are read-only templates used to create containers.

---

## Docker Containers

Containers are running instances of Docker images.

---

## Essential Commands

```bash id="u2cmds"
docker run <image>
docker ps
docker ps -a
docker stop <container>
docker start <container>
docker restart <container>
docker rm <container>
docker images
docker rmi <image>
```

---

## Running Containers

```bash id="u2run"
docker run nginx
docker run -it ubuntu bash
```

---

## Port Mapping

```bash id="u2ports"
docker run -p 8080:80 nginx
```

---

## Detached Mode

```bash id="u2detach"
docker run -d nginx
```

---

## Viewing Logs

```bash id="u2logs"
docker logs <container_id>
```

---

## Docker Exec - Running Commands in Containers

Docker Exec allows you to execute commands inside a running container.

### Check OS inside container

```bash id="u2exec1"
docker exec <container_id> cat /etc/os-release
```

### Interactive shell

```bash id="u2exec2"
docker exec -it <container_id> bash
```

---

# Unit 3: Dockerfile and Docker Compose

## What is a Dockerfile?

A Dockerfile is a script that contains instructions to build a Docker image.

---

## Example Dockerfile

```dockerfile id="u3dockerfile"
FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
```

---

## Build Image from Dockerfile

```bash id="u3build"
docker build -t my-app .
```

---

## Run Built Image

```bash id="u3run"
docker run -p 3000:3000 my-app
```

---

## Docker Compose

Docker Compose is used to run multi-container applications.

---

## Example docker-compose.yml

```yaml id="u3compose"
version: '3'
services:
  web:
    image: nginx
    ports:
      - "8080:80"

  app:
    build: .
    ports:
      - "3000:3000"
```

---

## Docker Compose Commands

```bash id="u3composecmds"
docker-compose up
docker-compose down
docker-compose build
```

---

## Volumes (Data Persistence)

```bash id="u3volumes"
docker run -v myvolume:/data nginx
```

---

## Networks

```bash id="u3network"
docker network ls
docker network create mynetwork
```

---



