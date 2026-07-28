---
title: "Docker Short Notes & Cheat Sheet"
description: "Reference guide and cheat sheet for DevOps Engineers on Docker basics, architecture, commands, and volumes."
pubDate: 2026-07-29
category: "Architecture"
tags: ["Docker", "DevOps", "Containerization", "Infrastructure", "CheatSheet"]
draft: false
featured: true
---

This document defines a baseline reference for Docker architecture, components, and commands based on standard DevOps practices[cite: 1, 2].

## Docker Architecture Lifecycle

<div class="mermaid">
flowchart LR
  subgraph Client
    A[Docker Client]
  end
  
  subgraph Docker Host
    B[Docker Daemon]
    C[Images]
    D[Containers]
  end
  
  subgraph Registry
    E[Docker Hub / Private Registry]
  end

  A -->|docker build / pull / run| B
  B -->|Creates| C
  B -->|Runs| D
  B <-->|Pull / Push| E
</div>

---

## Basics of Docker

*   Docker is an open-source centralized platform designed to create, deploy, and run applications[cite: 1].
*   It was first released in March 2013 and developed by Solomon Hykes and Sebastien Paul[cite: 1].
*   The tool performs OS-level virtualization, which is also known as containerization[cite: 1].
*   Docker is written in the 'GO' language[cite: 1].
*   It utilizes containers on the host operating system to run applications, sharing the same Linux Kernel instead of creating a full virtual operating system[cite: 1].
*   The Docker engine runs natively on Linux distributions, though it can be installed on any operating system[cite: 1].
*   Before Docker, users faced issues where code would run on a developer's system but fail on the user's system[cite: 1].
*   When an image is running, it is called a container[cite: 1].
*   When a container is in a non-runnable state, it is referred to as an image[cite: 1].
*   An image serves as a template, and the container is a copy of that template holding the entire package needed to run the application[cite: 1].

---

## Advantages and Disadvantages

| Advantages | Disadvantages |
| :--- | :--- |
| Requires no pre-allocation of RAM[cite: 1]. | Not a good solution for applications requiring a rich GUI[cite: 1]. |
| Provides CI Efficiency by allowing the same container image to be used across every deployment step[cite: 1]. | Difficult to manage a large number of containers[cite: 1]. |
| Results in less cost and is lightweight[cite: 1]. | Lacks cross-platform compatibility (e.g., Windows containers cannot run on Linux)[cite: 1]. |
| Can run on physical hardware, virtual hardware, or in the cloud[cite: 1]. | Requires Virtual Machines if the development OS and testing OS are different[cite: 1]. |
| Images can be re-used and container creation takes very little time[cite: 1]. | Does not provide a built-in solution for Data Recovery and Backup[cite: 1]. |

---

## Core Components

*   **Docker Daemon:** Runs on the Host OS and is responsible for running containers and managing Docker services[cite: 1]. Docker daemons can communicate with other daemons[cite: 1].
*   **Docker Client:** Uses commands and Rest APIs to allow users to interact and communicate with the Docker daemon[cite: 1]. A client can communicate with more than one daemon[cite: 1].
*   **Docker Host:** Provides the environment to execute applications and contains the docker daemon, images, containers, networks, and storage[cite: 1].
*   **Docker Hub/Registry:** Manages and stores Docker images[cite: 1]. Registries can be Public (Docker Hub) or Private (used within an enterprise)[cite: 1].
*   **Docker Images:** Read-only binary templates used to create containers, containing all dependencies and configurations required to run a program[cite: 1].

---

## Dockerfile Instructions

```bash
# Sets the base image and must be at the top of the docker file[cite: 1, 2]
FROM <image>

# Sets the base image and names the build stage[cite: 2]
FROM <image> AS <name>

# Executes a command as part of the build process and creates a layer[cite: 1, 2]
RUN <command>

# Executes a command as part of the build process (exec form)[cite: 2]
RUN ["exec", "param1", "param2"]

# Defines the Author, Owner, or Description[cite: 1]
MAINTAINER <name>

# Executes a command when the container starts[cite: 1, 2]
CMD ["exec", "param1", "param2"]

# Configures the container to run as an executable; has higher priority than CMD[cite: 1, 2]
ENTRYPOINT ["exec", "param1"]

# Sets an environment variable[cite: 1, 2]
ENV <key>=<value>

# Exposes a port (e.g., 8080 for tomcat, 80 for Nginx)[cite: 1, 2]
EXPOSE <port>

# Copies files from source to destination (local system to container)[cite: 1, 2]
COPY <src> <dest>

# Copies files from a build stage to a destination[cite: 2]
COPY --from=<name> <src> <dest>

# Similar to COPY, but provides features to download files from the internet and extract files[cite: 1]
ADD <src> <dest>

# Sets the working directory for a container[cite: 1, 2]
WORKDIR <path>

# Creates a mount point[cite: 2]
VOLUME <path>

# Sets the user[cite: 2]
USER <user>

# Defines a build argument[cite: 1, 2]
ARG <name>

# Defines a build argument with a default value[cite: 2]
ARG <name>=<default>

# Sets a metadata label[cite: 2]
LABEL <key>=<value>

# Sets a healthcheck command[cite: 2]
HEALTHCHECK <command>
```

---

## Commands Cheat Sheet

### Container Commands

```bash
# Create and run a new container[cite: 2]
docker run <image>

# Gives a name to the container and runs in interactive mode directed to the terminal[cite: 1]
docker run -it --name <container_name> <image_name> /bin/bash

# Run a container in the background[cite: 2]
docker run -d <image>

# Publish container port 80 to host port 8080[cite: 2]
docker run -p 8080:80 <image>

# Mount a host directory to a container[cite: 2]
docker run -v <host>:<container> <image>

# List currently running containers[cite: 1, 2]
docker ps

# List all containers (running or stopped)[cite: 1, 2]
docker ps --all
# Alternatively: docker ps -a

# Fetch the logs of a container[cite: 2]
docker logs <container name>

# Fetch and follow the logs of a container[cite: 2]
docker logs -f <container name>

# Stop a running container[cite: 1, 2]
docker stop <container name>

# Start a stopped container[cite: 1, 2]
docker start <container name>

# Remove a container[cite: 1, 2]
docker rm <container name>
```

### Executing Commands in a Container

```bash
# Go inside the container by connecting the standard I/O of the main process to the terminal[cite: 1]
docker attach <container_name>

# Execute a command in a running container[cite: 2]
docker exec <container name> <command>

# Open a shell in a running container[cite: 2]
docker exec -it <container name> bash
```

### Registry Commands

```bash
# Login to Docker Hub[cite: 2]
docker login

# Logout of Docker Hub[cite: 2]
docker logout

# Login to another container registry[cite: 2]
docker login <server>

# Logout of another container registry[cite: 2]
docker logout <server>

# Upload an image to a registry[cite: 2]
docker push <image>

# Search Docker Hub for images[cite: 1, 2]
docker search <image>

# Download an image from a registry to a local machine[cite: 1, 2]
docker pull <image>
```

### Image Commands

```bash
# Build a new image from the Dockerfile in the current directory and tag it[cite: 1, 2]
docker build -t <image> .

# List local images[cite: 1, 2]
docker images

# Remove an image[cite: 1, 2]
docker rmi <image>
# Alternatively: docker image rm <image>

# Create an image of a running container[cite: 1]
docker commit <container_name> <container_image_name>

# Check differences between base image and container changes[cite: 1]
docker diff <old_container_name>
```

### System Commands

```bash
# Check whether the Docker service is starting or not[cite: 1]
service docker status

# Show Docker disk usage[cite: 2]
docker system df

# Pull changes from the remote repository / Remove unused data[cite: 2]
docker system prune

# Remove all unused data[cite: 2]
docker system prune -a
```

### Networking Commands

```bash
# Create a docker network with custom bridge[cite: 2]
docker network create --driver <driver name> <network name>

# Connect a running Docker Container to an existing Network[cite: 2]
docker network connect <network-name> <container-name or id>

# Get details of a Docker Network[cite: 2]
docker network inspect <network-name>

# List all the Docker Networks[cite: 2]
docker network ls

# Remove a Container from the Network[cite: 2]
docker network disconnect <network-name> <container-name>

# Remove a Docker Network[cite: 2]
docker network rm <network-name>

# Remove all the unused Docker Networks[cite: 2]
docker network prune
```

### Docker Compose Commands

```bash
# Create and start containers[cite: 2]
docker compose up

# Create and start containers in background[cite: 2]
docker compose up -d

# Rebuild images before starting containers[cite: 2]
docker compose up --build

# Stop services[cite: 2]
docker compose stop

# Stop and remove containers and networks[cite: 2]
docker compose down

# List running containers[cite: 2]
docker compose ps

# View the logs of all containers[cite: 2]
docker compose logs

# View the logs of a specific service[cite: 2]
docker compose logs <service>

# View and follow the logs[cite: 2]
docker compose logs -f

# Build or rebuild services[cite: 2]
docker compose build

# Pull the latest images[cite: 2]
docker compose pull

# Pull latest images before building[cite: 2]
docker compose build --pull
```

### Docker Scout Commands

```bash
# Command-line tool for Docker Scout[cite: 2]
docker scout

# Quick overview of an image[cite: 2]
docker scout quickview

# Compare two images and display differences[cite: 2]
docker scout compare

# Display available base image updates and remediation recommendations[cite: 2]
docker scout recommendations

# Display base image update recommendations[cite: 2]
docker scout recommendations <image_name>

# Compare an image to the latest tag[cite: 2]
docker scout compare --to <image_name>:latest <image_name>:v1.2.3-pre
```

---

## Docker Volumes

Volumes are simply directories inside a container used to decouple containers from storage[cite: 1]. 

*   Directories must be declared as a volume during container creation; they cannot be created from an existing container[cite: 1].
*   Volumes can be accessed even if the container is stopped, and they are not deleted when the container is deleted[cite: 1].
*   Volumes are not included when you update an image[cite: 1].
*   Volumes can be shared across multiple containers (Container to Container) or mapped from the host (Host to Container)[cite: 1].

### Volume Commands

```bash
# Create a standard Docker volume[cite: 1]
docker volume create <volume_name>

# List all volumes[cite: 1]
docker volume ls

# Inspect a volume for details[cite: 1]
docker volume inspect <volume_name>

# Inspect a container for details[cite: 1]
docker container inspect <container_name>

# Remove a specific volume[cite: 1]
docker volume rm <volume_name>

# Prune all unused volumes[cite: 1]
docker volume prune

# Run a container with a shared volume from another container[cite: 1]
docker run -it --name <container_name> --privileged=true --volumes-from <container_name> <os_image_name> /bin/bash

# Run a container and map a host directory to a container volume[cite: 1]
docker run -it --name <container_name> -v /home/ec2-user:/<volume_name> --privileged=true <os_name> /bin/bash
```

---

## Execution vs. Attachment & Port Exposing

*   **`docker attach` vs `docker exec`:** The `exec` command creates a new process in the container's environment, suitable for running new shells or processes[cite: 1]. The `attach` command connects the standard I/O of the main process inside the container to the current terminal[cite: 1].
*   **No exposure or publish (`-p`):** The service is only accessible from inside the container itself[cite: 1].
*   **`expose` only:** The service is accessible from inside other Docker containers (inter-container communication), but not from outside Docker[cite: 1].
*   **`expose` and `-p`:** The service is accessible from anywhere, including outside Docker[cite: 1].
*   **Implicit Exposure:** If you publish a port (`-p`) but do not explicitly expose it, Docker performs an implicit expose, meaning a public port is automatically open to other Docker containers[cite: 1].
