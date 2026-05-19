# Stage 1: Build Stage
FROM node:22.19-alpine AS build



ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build





# Stage 2: Production Stage
FROM node:22.19-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]