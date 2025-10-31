FROM node:18-alpine

WORKDIR /app

# Copy package files first to leverage Docker cache for installs
COPY package.json package-lock.json* ./

# If package-lock.json is present, npm ci could be used. Use npm install as a safe default.
RUN npm install --production

COPY . .

EXPOSE 8000

CMD ["node", "src/index.js"]
