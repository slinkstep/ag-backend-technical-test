# Backend Technical Test Project

  

## Introduction

  

This project is a NestJS API that implements a GraphQL endpoint. It serves as a solution for a technical test for a backend position. The application provides functionalities related to user authentication, campaign management, betting system, transactions, and admin functionalities.

  

## Features

-  **User Authentication** : Registration, login, password reset for users.

-  **Admin Authentication** : Registration, login, password reset for admins.

-  **Campaign Management** : Create and manage promotional campaigns.

-  **Betting System** : Users can place bets with real or bonus balances.

-  **Transactions** : Record transactions related to bets, campaigns, and user balances.

-  **Firebase Integration** : Authentication and password management via Firebase.

-  **AWS SSM Parameter Store Integration** : Configuration management using AWS SSM.

-  **Role-Based Access Control** : Guards and decorators to protect routes based on user roles.


### Prerequisites

-  **Node.js** : Ensure you have Node.js installed (v14 or higher recommended).

-  **npm** : Comes with Node.js.

-  **AWS Account** : For SSM Parameter Store.

-  **Firebase Account** : For Firebase Authentication.

-  **MySQL** : Database for storing application data.

  

### Steps

1.  **Clone the Repository**

  

```bash

git  clone <repository-url>

cd <repository-directory>

```

2.  **Install Dependencies**

  

```bash

npm  install

```

3.  **Set Up Environment Variables** Create a `.env` file in the root directory and add the necessary environment variables.

  

```dotenv

# Firebase

FIREBASE_API_KEY=your-firebase-api-key

FIREBASE_CREDENTIALS=base64-encoded-service-account-json

  

# JWT

JWT_SECRET=your-jwt-secret

  

# Database

DATABASE_HOST=your-database-host

DATABASE_PORT=your-database-port

DATABASE_USERNAME=your-database-username

DATABASE_PASSWORD=your-database-password

DATABASE_NAME=your-database-name

  

# AWS SSM

AWS_ACCESS_KEY_ID=your-aws-access-key

AWS_SECRET_ACCESS_KEY=your-aws-secret-key

AWS_REGION=your-aws-region

```

**Note** : Some configuration values are fetched from AWS SSM. Ensure the AWS credentials have access to SSM Parameter Store.

4.  **Run Database Migrations**

If you have migrations set up, run them to create the necessary tables.

  
  

```bash

# Example using Sequelize CLI

npx  sequelize  db:migrate

```

  

## Configuration

The application uses AWS SSM Parameter Store to fetch configuration values at runtime. The `SSMConfigService` handles caching and refreshing of these values.

**Parameters Used:**

-  `/ag-backend-test/auth/authSecret`: JWT secret key.

-  `/ag-backend-test/app/betMargin`: Default bet margin value.

  

- Other database and Firebase configurations can also be stored in SSM.

**Firebase Configuration:**

-  **FIREBASE_API_KEY** : Your Firebase project's API key.

-  **FIREBASE_CREDENTIALS** : Base64-encoded Firebase service account JSON.

  

## Running the Application

  

### Development Mode

  
  

```bash

npm  run  start:dev

```

  

This command starts the application in watch mode, automatically reloading on code changes.

  

### Production Mode

  
  

```bash

npm  run  build

npm  run  start:prod

```

  

### Accessing the Application

By default, the application runs on `http://localhost:3000`.

### GraphQL Playground

You can access the GraphQL Playground at `http://localhost:3000/graphql`.

## API Documentation

  

### User Operations

-  **Register User**

  

```graphql

mutation {

registerUser(input: {

name: "John Doe",

authProviderEmail: "john@example.com",

password: "securepassword",

promoCode: "WELCOME"

}) {

id

name

authProviderEmail

}

}

```

-  **Login User**

  

```graphql

mutation {

loginUser(input: {

authProviderEmail: "john@example.com",

password: "securepassword"

}) {

token

user {

id

name

}

}

}

```

-  **Reset User Password**

  

```graphql

query {

resetUserPassword(email: "john@example.com") {

resetLink

}

}

```

-  **Claim Campaign**

  

```graphql

mutation {

userClaimCampaign(input: {

promoCode: "WELCOME",

category: SIGNUP

}) {

claimed

campaign {

id

name

}

}

}

```

  

### Admin Operations

-  **Register Admin**

  

```graphql

mutation {

registerAdmin(input: {

name: "Admin User",

authProviderEmail: "admin@example.com",

password: "adminpassword"

}) {

id

name

authProviderEmail

}

}

```

-  **Login Admin**

  

```graphql

mutation {

loginAdmin(input: {

authProviderEmail: "admin@example.com",

password: "adminpassword"

}) {

token

admin {

id

name

}

}

}

```

-  **Reset Admin Password**

  

```graphql

query {

resetAdminPassword(email: "admin@example.com") {

resetLink

}

}

```

-  **Create Campaign**

  

```graphql

mutation {

createCampaign(input: {

name: "Welcome Bonus",

promoCode: "WELCOME",

startDate: "2023-01-01T00:00:00Z",

endDate: "2023-12-31T23:59:59Z",

playableBalanceAmount: 100.0,

bonusBalanceAmount: 50.0,

category: SIGNUP,

status: ACTIVE

}) {

id

name

promoCode

}

}

```

  

### Betting Operations

-  **Create Bet**

  

```graphql

mutation {

createBet(input: {

amount: 10.0,

chance: 0.5,

roundId: "round123",

isBonus: false,

simulateSettlement: true

}) {

id

amount

payout

win

}

}

```

-  **Get Best Bet Per User**

  

```graphql

query {

getBestBetPerUser(limit: 10) {

id

userId

amount

payout

}

}

```

  

  



