# Educational CD: package the lab catalog API as a runnable image.
# In a real team this Dockerfile usually lives with the product service (Dev ownership).
FROM node:20-alpine

WORKDIR /app

# Pure Node stdlib — no npm install needed
COPY provider/server.mjs ./server.mjs

ENV PROVIDER_HOST=0.0.0.0
ENV PROVIDER_PORT=4010
EXPOSE 4010

CMD ["node", "server.mjs"]
