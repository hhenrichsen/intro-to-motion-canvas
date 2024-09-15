FROM zenika/alpine-chrome:with-node

USER root
RUN apk update \
    && apk add --no-cache jq \
    && rm -rf /var/cache/apk/*
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN mkdir -p /usr/share/fonts/opentype
COPY fonts/otf/* /usr/share/fonts/opentype/
RUN fc-cache -f

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY vite.config.ts ./
COPY tsconfig.json ./
COPY public ./public
COPY src ./src
ENV START=0
ENV END=5

CMD tmp=$(mktemp) \
    && echo "Running tests from $START to $END" \
    && jq --arg start "$START" --arg end "$END" '.shared.range[0] = ($start|tonumber) | .shared.range[1] = ($end|tonumber)' src/project.meta > $tmp \
    && echo $(cat $tmp) \
    && mv $tmp src/project.meta \
    && npm run test -- run
