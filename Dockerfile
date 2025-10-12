# Multi-stage build for GlucoPredict
FROM python:3.11-slim as backend

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
EXPOSE 8000
CMD ["python", "main.py"]

# Frontend build stage
FROM node:18-alpine as frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final nginx stage
FROM nginx:alpine
COPY --from=frontend-build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]