# Velkommen til nye TSFF
Vi en en gruppe studenter som bygger den nye TSFF (Trondheims Student-FotballForening).

Under følger en guide for hvordan man setter opp systemet lokalt på egen maskin.

## Setup locally

First, make sure you have Docker installed and docker deamon running on your machine. The easiest way is probably to install Docker Desktop, which also provides a nice GUI for controlling your Docker containers.

PS: Make sure you don't have any (postgres) service running locally on port 5432 already.

### Create a .env file
This may be placed in the root of the repository.

Fill it with this the following:

```.env

DATABASE_URL="postgresql://root:password@localhost:5432/tsff"

AUTH_SECRET = "RandomString"
```

The `AUTH_SECRET` can be whatever for development locally, but is usually generated like this:
```
openssl rand -base64 32
```
### Then, continue with the setup like this:

```bash
# First, install all dependencies
npm i

# Custom command that starts a Postgres Docker container and uses Prisma so generate the tables
npm run docker:fresh

# Seed the database with some dummy data
npm run db:seed

# Start the development server
npm run dev

```