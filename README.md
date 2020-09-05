## Patch Library API

### Description
This app was created based on a regular router-model-controller pattern. For the user's authorization, we used JWT. There are two user roles: `admin` and `user`.

### How to run?

1. Clone repository using the command:
#### `git clone https://github.com/dzetsyn/patch-library.git`

2. Install node modules using commands:
#### `cd patch-library`
#### `npm install`

3. Create a `.env` file. You can copy-paste `.env.example` and rename it. Don't forget to provide `MONGO_URI` value for the DB connection.

4. Run the app, using:
#### `npm run dev`

### API Documentation
You can find all API requests in the Postman Collection file in the root folder: `patch-library.postman_collection.json`

