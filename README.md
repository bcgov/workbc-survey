# workbc-survey
 A repository to hold templates and code for the WorkBC Surveys.

# Docker Installation and Setup

## Step 1: Install Docker

Make sure you have Docker installed on your machine. You can download and install Docker from the [Docker official website](https://www.docker.com/get-started).

## Step 2: Verify Docker installation

After installing Docker, open a terminal and run the following command to verify that Docker is installed correctly:

```bash
docker --version
```

# Setup the Postgres Database

Run the following command to start a new PostgreSQL database:

```bash
docker run --name my-postgres-db -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```


# Node-Cron Application Installation and Setup

## Step 1: Install Node.js and npm

Make sure you have Node.js and npm (Node Package Manager) installed on your machine. You can download and install them from [Node.js official website](https://nodejs.org/).

## Step 2: cd into cron and install all packages

Run the following commands

```bash
cd cron
npm install
```

## Step 3: fill out the .env with the required environment variables

Check .env.example to fill out all environment variables, this can also be taken from the production application.

## Step 4: Run the following command to start the CRON job:

```bash
npx nodemon app.ts
```