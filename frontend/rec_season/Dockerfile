FROM node:18
WORKDIR ./rec_season
COPY . .
RUN  npm install --legacy-peer-deps
RUN npm install --legacy-peer-deps axios
EXPOSE 3000
CMD ["npm","start"]