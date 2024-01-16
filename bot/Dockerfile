FROM oven/bun
# ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /workspace/bot
COPY package*.json ./
RUN bun install

COPY . .

CMD ["bun", "run", "start"]
