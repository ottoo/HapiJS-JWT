FROM node:7.3.0

# Install yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN $HOME/.yarn/bin/yarn install --pure-lockfile

# Bundle app source
COPY . /usr/src/app

EXPOSE 3334
CMD [ "npm", "run", "server:dev" ]
