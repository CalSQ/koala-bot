FROM oven/bun

WORKDIR /workspace/bot
COPY package*.json ./
RUN bun install

COPY . .

CMD ["sh", "-c", "bun run ${MODE}"]
