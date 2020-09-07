## Patch Library API

### Description
This app was created based on a regular Model-Routes-Controllers-Services pattern. For the user's authorization, we used JWT. There are two user roles: `admin` and `user`.

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

### Example Test Flow
1. Login using librarian credentials through Auth/login
`POST: http://localhost:3000/login`
2. Create new book using API: Books/books
`POST: http://localhost:3000/books`
3. Get a list of all available books on library and make sure your new book has successfully created:
`GET: http://localhost:3000/books`
4. Checkout a newly created book using API: Library/checkout
`POST: http://localhost:3000/library/checkout`
5. Return that book using API: Library/return
`POST: http://localhost:3000/library/return`
6. Get a list of all overdue books using API: Library/overdueBooks
`GET: http://localhost:3000/library/overdueBooks`
