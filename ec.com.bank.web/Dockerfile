FROM node:22.13.1 AS build

ARG BUILD_CONFIGURATION=Development

ARG VITE_BASE_API
ARG VITE_IMAGE_VISOR
ARG VITE_APP_VERSION
ARG VITE_APP_CODE

ENV VITE_BASE_API=$VITE_BASE_API
ENV VITE_IMAGE_VISOR=$VITE_IMAGE_VISOR
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_APP_CODE=$VITE_APP_CODE
ENV VITE_ENVIRONMENT=$BUILD_CONFIGURATION

WORKDIR /src

COPY ["ec.com.bank.web/package.json", "./package.json"]
COPY ["ec.com.bank.web/yarn.lock", "./yarn.lock"]
COPY [".ci-cd/nginx.conf", "./"]

RUN yarn --ignore

COPY ["ec.com.bank.web/", "./"]


RUN if [ "$BUILD_CONFIGURATION" = "Production" ]; then yarn build-prd; fi

RUN if [ "$BUILD_CONFIGURATION" = "Qa" ]; then yarn build-qas; fi
 
RUN if [ "$BUILD_CONFIGURATION" = "Development" ]; then yarn build-dev; fi

FROM nginx:stable-alpine3.20-slim AS final

RUN apk add brotli nginx nginx-mod-http-brotli

COPY --from=build /src/dist /usr/share/nginx/html

COPY --from=build /src/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 7070

CMD ["nginx", "-g", "daemon off;"]