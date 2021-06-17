# pull the base image
FROM node:alpine

# set the working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

WORKDIR /app/client
COPY client/package.json ./
COPY client/package-lock.json ./
RUN npm install

WORKDIR /app

# add app
COPY . ./ 

WORKDIR /app/client
RUN npm run build-client
WORKDIR /app

EXPOSE 8080
# start app
CMD ["npm", "start"]