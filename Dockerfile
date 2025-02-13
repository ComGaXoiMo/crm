FROM 540660100971.dkr.ecr.ap-southeast-1.amazonaws.com/node:16-alpine
WORKDIR /usr/src/app
COPY . .
RUN yarn install
RUN yarn build

ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 3000

CMD ["node_modules/.bin/craco", "start"]
