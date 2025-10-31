# build stage
FROM node:18-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
# Use `npm install` when there is no package-lock.json in the repo
# If you want deterministic installs, commit package-lock.json and switch back to `npm ci`
RUN npm install

COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
