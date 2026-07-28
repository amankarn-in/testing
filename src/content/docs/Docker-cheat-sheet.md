---
title: "Docker Short Notes & Cheat Sheet"
description: "Reference guide and cheat sheet for DevOps Engineers on Docker basics, architecture, commands, and volumes."
pubDate: 2026-07-29
category: "Architecture"
tags: ["Docker", "DevOps", "Containerization", "Infrastructure", "CheatSheet"]
draft: false
featured: true
---

This document defines a baseline reference for Docker architecture, components, and commands based on the provided notes and the "CheatSheet_-_Docker_>_Docker_> (1).pdf" file[cite: 1, 2].

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

*   Docker is an open-source centralized platform designed to create, deploy, and run applications.
*   It was first released in March 2013 and developed by Solomon Hykes and Sebastien paul.
*   The tool performs OS-level virtualization, which is also known as containerization.
*   Docker is written in the 'GO' language.
*   It utilizes containers on the host operating system to run applications, sharing the same Linux Kernel instead of creating a full virtual operating system.
*   The Docker engine runs natively on Linux distributions, though it can be installed on any operating system.
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

## Installation & Account Setup

*   **Docker (Linux):** `https://docs.docker.com/engine/install/`[cite: 2].
*   **Docker Desktop (Linux, Windows, Mac):** `https://docs.docker.com/desktop/`[cite: 2].

---

## Dockerfile Instructions

A Dockerfile is a text file containing sets of instructions used for the automation of Docker image creation[cite: 1]. 

| Command | Description |
| :--- | :--- |
| `FROM <image>` | Sets the base image and must be at the top of the docker file[cite: 1, 2]. |
| `FROM <image> AS <name>` | Sets the base image and names the build stage[cite: 2]. |
| `RUN <command>` | Executes a command as part of the build process and creates a layer[cite: 1, 2]. |
| `RUN ["exec", "param1", "param2"]` | Executes a command as part of the build process[cite: 2]. |
| `MAINTAINER` | Defines the Author, Owner, or Description[cite: 1]. |
| `CMD ["exec", "param1", "param2"]` | Executes a command when the container starts[cite: 1, 2]. |
| `ENTRYPOINT ["exec", "param1"]` | Configures the container to run as an executable; has higher priority than CMD[cite: 1, 2]. |
| `ENV <key>=<value>` | Sets an environment variable[cite: 1, 2]. |
| `EXPOSE <port>` | Exposes a port (e.g., 8080 for tomcat, 80 for Nginx)[cite: 1, 2]. |
| `COPY <src> <dest>` | Copies files from source to destination (local system to container)[cite: 1, 2]. |
| `COPY --from=<name> <src> <dest>` | Copies files from a build stage to a destination[cite: 2]. |
| `ADD` | Similar to COPY, but provides features to download files from the internet and extract files[cite: 1]. |
| `WORKDIR <path>` | Sets the working directory for a container[cite: 1, 2]. |
| `VOLUME <path>` | Creates a mount point[cite: 2]. |
| `USER <user>` | Sets the user[cite: 2]. |
| `ARG <name>` | Defines a build argument[cite: 1, 2]. |
| `ARG <name>=<default>` | Defines a build argument with a default value[cite: 2]. |
| `LABEL <key>=<value>` | Sets a metadata label[cite: 2]. |
| `HEALTHCHECK <command>`| Sets a healthcheck command[cite: 2]. |

---

## Commands Cheat Sheet

### Container Commands
| Command | Description |
| :--- | :--- |
| `docker run <image>` | Create and run a new container[cite: 2]. |
| `docker run -it --name <container_name> <image_name> /bin/bash` | Gives a name to the container and runs in interactive mode directed to the terminal[cite: 1]. |
| `docker run -d <image>` | Run a container in the background[cite: 2]. |
| `docker run -p 8080:80 <image>` | Publish container port 80 to host port 8080[cite: 2]. |
| `docker run -v <host>:<container> <image>` | Mount a host directory to a container[cite: 2]. |
| `docker ps` | List currently running containers[cite: 1, 2]. |
| `docker ps --all` (or `-a`) | List all containers (running or stopped)[cite: 1, 2]. |
| `docker logs <container name>` | Fetch the logs of a container[cite: 2]. |
| `docker logs -f <container name>` | Fetch and follow the logs of a container[cite: 2]. |
| `docker stop <container name>` | Stop a running container[cite: 1, 2]. |
| `docker start <container name>` | Start a stopped container[cite: 1, 2]. |
| `docker rm <container name>` | Remove a container[cite: 1, 2]. |

### Executing Commands in a Container
| Command | Description |
| :--- | :--- |
| `docker attach <container_name>` | Go inside the container by connecting the standard I/O of the main process to the terminal[cite: 1]. |
| `docker exec <container name> <command>` | Execute a command in a running container[cite: 2]. |
| `docker exec -it <container name> bash` | Open a shell in a running container[cite: 2]. |

### Registry Commands
| Command | Description |
| :--- | :--- |
| `docker login` | Login to Docker Hub[cite: 2]. |
| `docker logout` | Logout of Docker Hub[cite: 2]. |
| `docker login <server>` | Login to another container registry[cite: 2]. |
| `docker logout <server>` | Logout of another container registry[cite: 2]. |
| `docker push <image>` | Upload an image to a registry[cite: 2]. |
| `docker search <image>` | Search Docker Hub for images[cite: 1, 2]. |
| `docker pull <image>` | Download an image from a registry to a local machine[cite: 1, 2]. |

### Image Commands
| Command | Description |
| :--- | :--- |
| `docker build -t <image> .` | Build a new image from the Dockerfile in the current directory and tag it[cite: 1, 2]. |
| `docker images` | List local images[cite: 1, 2]. |
| `docker rmi <image>` (or `image rm`) | Remove an image[cite: 1, 2]. |
| `docker commit <container_name> <container_image_name>` | Create an image of a container[cite: 1]. |

### System Commands
| Command | Description |
| :--- | :--- |
| `service docker status` | Check whether the service is starting or not[cite: 1]. |
| `docker system df` | Show Docker disk usage[cite: 2]. |
| `docker system prune` | Pull changes from the remote repository / Remove unused data[cite: 2]. |
| `docker system prune -a` | Remove all unused data[cite: 2]. |

### Networking Commands
| Command | Description |
| :--- | :--- |
| `docker network create --driver <driver name> <network name>` | Create a docker network with custom bridge[cite: 2]. |
| `docker network connect <network-name> <container-name or id>`| Connect a running Docker Container to an existing Network[cite: 2]. |
| `docker network inspect <network-name>` | Get details of a Docker Network[cite: 2]. |
| `docker network ls` | List all the Docker Networks[cite: 2]. |
| `docker network disconnect <network-name> <container-name>` | Remove a Container from the Network[cite: 2]. |
| `docker network rm <network-name>` | Remove a Docker Network[cite: 2]. |
| `docker network prune` | Remove all the unused Docker Networks[cite: 2]. |

### Docker Compose Commands
| Command | Description |
| :--- | :--- |
| `docker compose up` | Create and start containers[cite: 2]. |
| `docker compose up -d` | Create and start containers in background[cite: 2]. |
| `docker compose up --build` | Rebuild images before starting containers[cite: 2]. |
| `docker compose stop` | Stop services[cite: 2]. |
| `docker compose down` | Stop and remove containers and networks[cite: 2]. |
| `docker compose ps` | List running containers[cite: 2]. |
| `docker compose logs` | View the logs of all containers[cite: 2]. |
| `docker compose logs <service>` | View the logs of a specific service[cite: 2]. |
| `docker compose logs -f` | View and follow the logs[cite: 2]. |
| `docker compose build` | Build or rebuild services[cite: 2]. |
| `docker compose pull` | Pull the latest images[cite: 2]. |
| `docker compose build --pull` | Pull latest images before building[cite: 2]. |

### Docker Scout Commands
| Command | Description |
| :--- | :--- |
| `docker scout` | Command-line tool for Docker Scout[cite: 2]. |
| `docker scout quickview` | Quick overview of an image[cite: 2]. |
| `docker scout compare` | Compare two images and display differences[cite: 2]. |
| `docker scout recommendations` | Display available base image updates and remediation recommendations[cite: 2]. |
| `docker scout recommendations <image_name>` | Display base image update recommendations[cite: 2]. |
| `docker scout compare --to <image_name>:latest <image_name>:v1.2.3-pre` | Compare an image to the latest tag[cite: 2]. |

---

## Docker Volumes

Volumes are simply directories inside a container used to decouple containers from storage[cite: 1]. 

*   Directories must be declared as a volume during container creation; they cannot be created from an existing container[cite: 1].
*   Volumes can be accessed even if the container is stopped, and they are not deleted when the container is deleted[cite: 1].
*   Volumes are not included when you update an image[cite: 1].
*   Volumes can be shared across multiple containers (Container to Container) or mapped from the host (Host to Container)[cite: 1].

### Volume Commands

```bash
# Create a standard Docker volume
docker volume create <volume_name>

# List all volumes
docker volume ls

# Inspect a volume or container for details
docker volume inspect <volume_name>
docker container inspect <container_name>

# Remove a specific volume or prune all unused volumes
docker volume rm <volume_name>
docker volume prune

# Run a container with a shared volume from another container
docker run -it --name <container_name> --privileged=true --volumes-from <container_name> <os_image_name> /bin/bash

# Run a container and map a host directory to a container volume
docker run -it --name <container_name> -v /home/ec2-user:/<volume_name> --privileged=true <os_name> /bin/bash