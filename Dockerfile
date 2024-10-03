FROM node:18

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

ENV PORT=5000

EXPOSE ${PORT}

CMD npx prisma migrate dev && npm run start:dev
