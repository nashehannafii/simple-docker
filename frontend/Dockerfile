# build stage
FROM node:18-alpine AS build
WORKDIR /app

# Allow injecting backend URL at build time; Vite will pick it up from .env
ARG VITE_BACKEND_URL

COPY package.json package-lock.json* ./
# Use `npm install` when there is no package-lock.json in the repo
# If you want deterministic installs, commit package-lock.json and switch back to `npm ci`
RUN npm install

COPY . .
# Write a Vite env file so import.meta.env.VITE_BACKEND_URL is available at build time
RUN if [ -n "$VITE_BACKEND_URL" ]; then echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env; else echo "VITE_BACKEND_URL=http://localhost:5001" > .env; fi
RUN npm run build

# production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
