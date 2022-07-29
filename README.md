# ED-Board

## Introduction

ED-Board is a digital rostering display board. It is developed to quickly and reliably display updated roster information for TTSH Emergency Department (ED).

Currently it can update and display doctors and nurses roster including showing up to 5 shifts for doctors and 3 shifts for nurse, display to 7 different board layouts to displayed at different locations in ED and show up to 28 rows of assignments per board.

## Getting Started

### Fresh install

1. Clone this repository
2. Install the node v16.15.0, npm v8.5.5, MongoDB v5.0.8 and MongoDB database tools
3. Install dependencies. Run `npm install` in `/ED-Board/frontend` and `/ED-Board/backend`
4. Restore database using mongorestore
`mongorestore /ED-Board/dump`

### Using Oracle Virtual Box

1. Clone virtual box image 
2. Log in to user `ed` with password `ed`

### Running servers

1. Ensure api url reflected in `~/ED-Board/frontend/.env.production` is correct
    - If yes skip to 3
2. Rebuild frontend. With CWD of `~/ED-Board/frontend` run `npm run build`
3. Run Mongo Daemon `sudo systemctl start mongod`
    - Use `sudo systemctl status mongod` to check if mongod is running successfully
4. Run frontend. With CWD of `~/ED-Board/frontend` run `serve -s build &`
5. Run backend. With CWD of `~/ED-Board/backend` run `nodemon server &`

6. Default super-admin username `admin` password `admin1234`
## User's Guide

[Link](./doc/Userguide.md)

## Developer's Guide

[Link](./doc/Developersguide.md)
