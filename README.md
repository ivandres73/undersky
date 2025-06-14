# UnderSky Social Media Prototype

This repository provides a **very** basic Node.js prototype for a social media
platform focused on sky photos.

## Features

- User registration, login, and logout using in-memory storage
- Photo upload with `multer`
- Basic endpoint to list all uploaded photos

## Setup

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
node server.js
```

The server runs on port `3000` by default.

## Usage

- Register a new user:

```bash
curl -X POST http://localhost:3000/register -d 'username=test&password=secret'
```

- Log in and upload a photo using a tool like `curl` or Postman.

This is only a minimal prototype. User accounts, image storage, reactions, the
web shop, and payout system are not implemented. Consider this a starting point
for further development.
