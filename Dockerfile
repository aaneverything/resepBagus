# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .


EXPOSE 3000

CMD ["npm", "run", "dev", "sh", "-c", "npx prisma migrate deploy && npm run start"]
