# TO DO

- Set up Cognito and Cognito Handler lambda
- ~~Set up CRON job bill updater Lambda~~
- Set up admin Lambda
- Field level resolvers for User Bills & categories
- Retool module for updating categories
- Set up Email & SMS notification service
- Set up notifications for when a new Bill or Event is created
- Document all Services, Utils and other logic

# Commons API - Rebuild

## CURRENTLY VERY MUCH NOT READY

#### Up-to-date information and notifications about bills in progress in Canada's parliament.

## API Server for the Commons App

Commons aims to provide an easy to access source of information on current bills in session in Canada's federal parliament. The application sources data from various sources and serves it up to users in one easy to use location.

The goal is to provide Canadians with an easy way to keep up to date with the goings on in parliament and engage with their government representatives. The information aggregated by the app is sourced from various public government websites.

Bills are updated daily and sorted by category on the server. Users can select between email and SMS notifications for any bills they wish to follow and will receive daily updates if there are any new events for those bills.

The application also provides an easy way to look up Members of Parliament and retrieve their contact information.

## Behaviour

The server updates once every 24 hours from a variety of government data sources and pulls the latest bill and event data from them. It then send notifications on those bills to all subscribed users.

# Stack

UPDATE (OUT OF DATE)

- [Node.js 12.16.1](https://nodejs.org/en/)
- [Express 4.17.0](https://expressjs.com/)
- [GraphQL 14.6.0](https://graphql.org/)
- [PostgreSQL 12.2](https://www.postgresql.org/)

## Testing

UPDATE (OUT OF DATE)

- [Jest 25.1.0](https://jestjs.io/)
