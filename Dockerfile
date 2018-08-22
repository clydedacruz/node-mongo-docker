from node:8-slim
WORKDIR /hello-world-app
COPY package.json .
RUN npm install
ADD VERSION .
COPY app.js .
EXPOSE 3000
CMD [ "npm", "start" ]

