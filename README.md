# TO DO

- NEXT UP:Set up Cognito and Cognito Handler lambda

- ~~Set up CRON job bill updater Lambda~~
- ~~Set up admin Lambda~~
- ~~Field level resolvers for User Bills & categories~~
- ~~Retool module for updating categories~~
- Set up Email & SMS notification service
- Set up notifications for when a new Bill or Event is created
- Document all Services, Utils and other logic

# Commons API - Rebuild

#### Up-to-date information and notifications about bills in progress in Canada's parliament.

## API Server for the Commons App

Commons aims to provide an easy to access source of information on current bills in session in Canada's federal parliament. The application sources data from various sources and serves it up to users in one easy to use location.

The goal is to provide Canadians with an easy way to keep up to date with the goings on in parliament and engage with their government representatives. The information aggregated by the app is sourced from various public government websites.

## Behaviour

The server updates once every 24 hours from a variety of government data sources and pulls the latest bill and event data from them. It then sends notifications on those bills to all subscribed users.

# Stack

- [Typescript](https://www.typescriptlang.org/)
- [GraphQL](https://graphql.org/)
- [MongoDB](https://www.mongodb.com/)

Libs

- [Node.js 14](https://nodejs.org/en/)
- [Mongoose 6.0.5](https://mongoosejs.com/)
- [Serverless 2.57.0](https://serverless.com/)

Infrastructure

- [AWS Cloud Services](https://aws.amazon.com/)
  - [Lambda](https://aws.amazon.com/lambda/)
  - [AppSync](https://aws.amazon.com/appsync/)
  - [Cognito](https://aws.amazon.com/cognito/)

# Admin Tooling

- [Retool](https://retool.com/)

# Testing

- [Jest 27.1.1](https://jestjs.io/)
