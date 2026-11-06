# ---------- faza 1: build Angulara ----------
FROM node:20-slim AS build
WORKDIR /app
ENV NG_CLI_ANALYTICS=false

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- faza 2: nginx servira gotove fajlove ----------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80