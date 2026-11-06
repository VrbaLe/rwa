# ---------- faza 1: build ----------
FROM node:20-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- faza 2: finalna slika ----------
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist


# folder za slike (multer ga ne pravi sam)
RUN mkdir -p uploads/salon-images

EXPOSE 3000
CMD ["node", "dist/main"]