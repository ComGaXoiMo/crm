# Introduction

# Required

node: v18.17.1
yarn: 1.22.19

# Build and Test

1. Download the repository and open terminal in your editor and run command
2. In command input: yarn install
3. To run project, input: yarn run serve
4. To build project, input : yarn run build

# Docker Build:

Window Env:

docker build -t pmhleasing-ui:latest .
docker run -it --name pmhleasing-ui -p 4201:80 pmhleasing-ui
WINDOW: winpty docker run -it --name pmhleasing-ui -p 4201:80 pmhleasing-ui

Linux Env:

sudo docker build -t pmhleasing-ui:latest .
sudo docker run -it --name pmhleasing-ui -p 4201:80 pmhleasing-ui
sudo docker run -it --name pmhleasing-ui -p 4201:80 pmhleasing-ui

end
