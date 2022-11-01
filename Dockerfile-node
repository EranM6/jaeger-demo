FROM node:18.12.0-slim

COPY  . /workspace/
WORKDIR /workspace/

#Make sure to allocate same memoty size to the service.
RUN export NODE_OPTIONS="--max-old-space-size=5120"

RUN rm -f /etc/localtime; ln -s /usr/share/zoneinfo/Asia/Jerusalem /etc/localtime
RUN yarn

EXPOSE 3000

CMD ["yarn", "start"]