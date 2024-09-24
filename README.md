# coders-boutique-assessment

### API Documentation

This documentation describes the authentication and password reset functionalities. The routes include user registration, login, forgot password, and reset password functionality.

---

## **Base URL**

The API is based on the following base URL:

```
http://localhost:3000
```

---

## **Register User**

### **POST** `/register`

This route allows a new user to register by providing a username, email, and password. The password is hashed using bcrypt before being stored in the database.

#### Request:

- **URL:** `/register`
- **Method:** `POST`
- **Headers:**
  - Content-Type: `application/json`
- **Body Parameters:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Response:

- **Success Response:**

  - **Code:** `201 Created`
  - **Content:**

    ```json
    {
      "user": {
        "_id": "user_id",
        "username": "string",
        "email": "string",
        "password": "hashed_password"
      },
      "token": "jwt_token"
    }
    ```

- **Error Response:**

  - **Code:** `400 Bad Request` (If the email already exists)
  - **Content:**

    ```json
    {
      "error": "User already exists"
    }
    ```

  - **Code:** `500 Internal Server Error` (On server error)
  - **Content:**

    ```json
    {
      "message": "Something went wrong"
    }
    ```

---

## **Login User**

### **POST** `/login`

This route allows an existing user to log in by providing their email and password. It checks if the email exists and if the password matches the hashed password in the database.

#### Request:

- **URL:** `/login`
- **Method:** `POST`
- **Headers:**
  - Content-Type: `application/json`
- **Body Parameters:**

```json
{
  "email": "string",
  "password": "string"
}
```

#### Response:

- **Success Response:**

  - **Code:** `200 OK`
  - **Content:**

    ```json
    {
      "user": {
        "_id": "user_id",
        "username": "string",
        "email": "string"
      },
      "token": "jwt_token"
    }
    ```

- **Error Response:**

  - **Code:** `400 Bad Request` (If the email does not exist or if the password is incorrect)
  - **Content:**

    ```json
    {
      "error": "User doesn't exist"
    }
    ```

  - **Code:** `400 Bad Request` (If the password is incorrect)
  - **Content:**

    ```json
    {
      "message": "Invalid Credentials"
    }
    ```

  - **Code:** `500 Internal Server Error` (On server error)
  - **Content:**

    ```json
    {
      "message": "Something went wrong"
    }
    ```

---

## **Forgot Password**

### **POST** `/forgot-password`

This route allows a user to request a password reset. The server sends a password reset link to the user's email with a JWT token that is valid for 15 minutes.

#### Request:

- **URL:** `/forgot-password`
- **Method:** `POST`
- **Headers:**
  - Content-Type: `application/json`
- **Body Parameters:**

```json
{
  "email": "string"
}
```

#### Response:

- **Success Response:**

  - **Code:** `200 OK`
  - **Content:**

    ```json
    {
      "message": "Password reset link sent to email"
    }
    ```

- **Error Response:**

  - **Code:** `404 Not Found` (If the email does not exist)
  - **Content:**

    ```json
    {
      "message": "User not found"
    }
    ```

  - **Code:** `500 Internal Server Error` (On server error)
  - **Content:**

    ```json
    {
      "message": "Something went wrong"
    }
    ```

---

## **Reset Password**

### **POST** `/reset-password`

This route allows a user to reset their password by providing a valid JWT token and a new password. The token is verified, and the user's password is updated with the new hashed password.

#### Request:

- **URL:** `/reset-password`
- **Method:** `POST`
- **Headers:**
  - Content-Type: `application/json`
- **Query Parameters:**

```json
{
  "token": "jwt_token"
}
```

- **Body Parameters:**

```json
{
  "newPassword": "string"
}
```

#### Response:

- **Success Response:**

  - **Code:** `200 OK`
  - **Content:**

    ```json
    {
      "message": "Password reset successful"
    }
    ```

- **Error Response:**

  - **Code:** `400 Bad Request` (If the token is invalid or the user does not exist)
  - **Content:**

    ```json
    {
      "message": "Invalid token or user does not exist"
    }
    ```

  - **Code:** `500 Internal Server Error` (On server error)
  - **Content:**

    ```json
    {
      "message": "Something went wrong"
    }
    ```

---

## **Environment Variables**

Make sure to configure the following environment variables:

```
MONGO_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
ADMIN_EMAIL=your_email@gmail.com
NODEMAILER_PASS=your_app_passsword
```

---

## **Error Handling**

- **400 Bad Request**: The server could not understand the request due to invalid syntax or incorrect user data.
- **500 Internal Server Error**: The server encountered an unexpected condition that prevented it from fulfilling the request.

---

## **Summary**

This API provides user authentication features, including registration, login, and password management (forgot and reset password). JWT tokens are used for both authentication and password reset functionality. The password reset link is sent via email using the `sendEmail` utility, which relies on Nodemailer.
