FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy app source
COPY . .

# Install app dependencies
RUN npm ci --legacy-peer-deps

# Bundle app source
RUN npm run build

WORKDIR ./dist

ENV NODE_ENV production

EXPOSE 3000

CMD ["npx", "serve"]
