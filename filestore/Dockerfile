FROM node:16.19.0-bullseye

RUN apt update
RUN apt upgrade -y
RUN apt install -y bash curl git

WORKDIR /app
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json
RUN npm install
ADD . /app

ENTRYPOINT [ "node", "server.js" ]
CMD [ "--port", "80", "--upload-dir", "/data", "--enable-folder-creation" ]