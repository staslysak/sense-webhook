FROM kdchubapp01.alfa.bank.int:8082/docker/node:latest as builder

RUN mkdir /app
WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED 0
RUN npm config set strict-ssl false && npm config set registry https://kdchubapp01.alfa.bank.int:8082/artifactory/api/npm/npm/

COPY . .
RUN npm i && npm run build

FROM gcr.io/distroless/nodejs:14

ENV NODE_ENV production

COPY --from=builder /app/build /app/build
COPY --from=builder /app/node_modules /app/node_modules
WORKDIR /app/build
USER nonroot

CMD ["index.js"]
