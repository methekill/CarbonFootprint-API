FROM node:10.16-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
COPY client/package*.json /usr/src/app/client/

RUN npm install --production
RUN npm install --prefix client --production

# Bundle app source
COPY . /usr/src/app
ENV REACT_APP_SENTRY_DSN=$REACT_APP_SENTRY_DSN
ENV REACT_APP_AUTH0_DOMAIN=$REACT_APP_AUTH0_DOMAIN
ENV REACT_APP_AUTH0_CLIENT_ID=$REACT_APP_AUTH0_CLIENT_ID
ENV REACT_APP_AUTH0_CALLBACK_URL=$REACT_APP_AUTH0_CALLBACK_URL
ENV REACT_APP_AUTH0_TOKEN_ENDPOINT=$REACT_APP_AUTH0_TOKEN_ENDPOINT
ENV REACT_APP_AUTH0_API_ENDPOINT=$REACT_APP_AUTH0_API_ENDPOINT
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_GOOGLE_FIT_SCOPES=$REACT_APP_GOOGLE_FIT_SCOPES

RUN npm run build --prefix client

# Add your preference
CMD [ "npm", "start" ]
