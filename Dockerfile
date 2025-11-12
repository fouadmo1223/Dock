FROM node:18-alpine as development

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3001

# Enable polling for nodemon
ENV CHOKIDAR_USEPOLLING=true


CMD ["npm", "run", "dev"]

#   Hot reload volume mapping example
# -v F:/Docker/node1/:/app:ro  ro=> read only one way binding to make the chnga on our 
# -v $(pwd):/app:ro  
# --env-file to pass environment variables from a file
# -v :/Docker/node1/node_modules # to prevent overwriting node_modules folder in the container with empty folder from
# host machine visible inside the container not the other way around
 # you should add absolute path before the host path when using Docker on Windows


FROM node:18-alpine as production

WORKDIR /app

COPY package.json .

RUN npm install --only=production

COPY . .

COPY --from=development /app/node_modules ./node_modules

EXPOSE 3001

CMD ["node", "index.js"]