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
ARG REACT_APP_SENTRY_DSN
ARG AUTH0_DOMAIN
ARG AUTH0_CLIENT_ID
ARG AUTH0_CALLBACK_URL
ARG AUTH0_TOKEN_ENDPOINT
ARG AUTH0_API_ENDPOINT
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_GOOGLE_FIT_SCOPES

ENV REACT_APP_SENTRY_DSN=$REACT_APP_SENTRY_DSN
ENV REACT_APP_AUTH0_DOMAIN=$AUTH0_DOMAIN
ENV REACT_APP_AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID
ENV REACT_APP_AUTH0_CALLBACK_URL=$AUTH0_CALLBACK_URL
ENV REACT_APP_AUTH0_TOKEN_ENDPOINT=$AUTH0_TOKEN_ENDPOINT
ENV REACT_APP_AUTH0_API_ENDPOINT=$AUTH0_API_ENDPOINT
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_GOOGLE_FIT_SCOPES=$REACT_APP_GOOGLE_FIT_SCOPES

RUN npm run build --prefix client

# Add your preference
CMD [ "npm", "start" ]
