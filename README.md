# URL Shortener Express.js

This is a simple URL shortener built with **Express.js** and **MongoDB**. It allows you to shorten long URLs, retrieve original URLs from shortened versions, and set expiration dates for URLs.

## Features

- Shorten long URLs
- Custom aliases for shortened URLs
- URL expiration feature
- Redirect to original URLs via short link
- View all shortened URLs

## Technologies Used

- **Node.js** (Runtime environment)
- **Express.js** (Web framework)
- **MongoDB** (Database)
- **Mongoose** (MongoDB ORM)
- **NanoID** (For generating unique short IDs)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/amreshpro/url-shortener-express.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd url-shortener-express
   ```

3. **Install dependencies:**

   Make sure you have **Node.js** and **npm** installed on your system. Install the required packages by running:

   ```bash
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env` file in the root directory and configure the following:

```env
PORT=3000
NODE_ENV=dev
DATABASE_URL=dburl
JWT_SECRET=my-jwt-secret
 ```

   You can change the MongoDB URI to use a remote MongoDB service if required.

5. **Start the server:**

   ```bash
   npm start
   ```

   The application will start running on `http://localhost:5000`.

---

## API Endpoints

### 1. **POST** `/api/urls`

Create a shortened URL.

#### Request Body:
```json
{
  "originalUrl": "https://example.com",
  "alias": "customAlias",  // Optional
  "expiration": "2024-12-31T23:59:59" // Optional, ISO format date
}
```

#### Response:
```json
{
  "shortUrl": "http://localhost:5000/customAlias",
  "originalUrl": "https://example.com"
}
```

---

### 2. **GET** `/api/urls`

Get all shortened URLs.

#### Response:
```json
[
  {
    "originalUrl": "https://example.com",
    "shortId": "customAlias",
    "expiresAt": null
  },
  {
    "originalUrl": "https://google.com",
    "shortId": "abc123",
    "expiresAt": "2024-12-31T23:59:59"
  }
]
```

---

### 3. **GET** `/api/urls/:id`

Redirect to the original URL from the short URL. If the URL has expired, you will get an error.

#### Response:
- **If found and not expired:** Redirects to the original URL.
- **If expired:** 
  ```json
  {
    "error": "URL has expired"
  }
  ```
- **If not found:** 
  ```json
  {
    "error": "URL not found"
  }
  ```

---

## Testing the API

You can use **Postman** or **cURL** to test the API:

### Create a Short URL:

- **POST** `/api/urls`
  
  Example request:
  ```json
  {
    "originalUrl": "https://example.com",
    "alias": "short1",
    "expiration": "2024-12-31T23:59:59"
  }
  ```

### Retrieve All URLs:

- **GET** `/api/urls`

### Redirect to Original URL:

- **GET** `/api/urls/short1`

---

## Running


**Build**

   ```bash
  bun run build
   ```

**Run**
 The application will be accessible at `http://localhost:3000`.

---




### **Contact**

For any queries, feel free to reach out:

- **GitHub**: [amreshpro](https://github.com/amreshpro)
- **Email**: [amresh.terminal@gmail.com](mailto:amresh.terminal@gmail.com)

---
