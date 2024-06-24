# react vite
FROM node:latest as build
WORKDIR /client-app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# server
FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /client-app/dist  /var/www/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
