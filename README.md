# SnapDeal_backend

# Snapdeal-Like Website Backend

This is the backend of our Snapdeal-like website project. It provides APIs for various functionalities required for the website.

# frontend repo link 

[Frontend repo link here--->](https://github.com/Vijendra2244/SnapDeal_frontend)

## Getting Started

To get started with this backend, follow these steps:

1. Clone this repository to your local machine.
2. Install the necessary dependencies using `npm install`.
3. Configure the environment variables as per the provided `.env.sample`.
4. Start the server using `npm start`.



## API Documentation

### Authentication

### User Registration

#### `users/register` (POST)

- **Description:** Register a new user.
- **Method:** POST
- **Request Body:**
  - `username`: String (required) - The username of the user.
  - `email`: String (required) - The email address of the user.
  - `password`: String (required) - The password for the user account. Password must meet the following criteria:
    - At least one uppercase character
    - At least one number
    - At least one special character
    - At least 8 characters long
  - `mobilenumber`: String - The mobile number of the user.
- **Request Headers:**
  - `Content-Type: application/json`
- **Request File:**
  - `avatar`: Image file (required) - The avatar image for the user profile.
- **Response:**
  - `status`: String (Success/Error) - Status of the registration process.
  - `msg`: String - Additional message indicating the result of the registration process.
  - `data`: Object - Data returned upon successful registration, containing:
    - `avatar`: String - URL of the uploaded avatar image.
- **Success Response Example:**
  ```json
   {
    "status": "success",
    "msg": "User has been created successfully",
    "data": {
      "avatar": "https://example.cloudinary.com/path/to/avatar.jpg"
    }
  } ```


### User Login

#### `users/login` (POST)

- **Description:** Login an existing user.
- **Method:** POST
- **Request Body:**
  - `email`: String (required) - The email address of the user.
  - `password`: String (required) - The password for the user account.
- **Request Headers:**
  - `Content-Type: application/json`
- **Response:**
  - `status`: String (Success/Error) - Status of the login process.
  - `msg`: String - Additional message indicating the result of the login process.
  - `avatar`: String - URL of the user's avatar image (if available).
- **Success Response Example:**
  ```json
  {
    "status": "success",
    "msg": "User login successfully",
    "avatar": "https://example.cloudinary.com/path/to/avatar.jpg"
  }


### User Logout

#### `users/logout` (POST)

- **Description:** Logout an existing user.
- **Method:** POST
- **Request Headers:**
  - `Authorization: Bearer <access_token>` (required) - Access token obtained during login.
- **Response:**
  - `status`: String (Success/Error) - Status of the logout process.
  - `msg`: String - Additional message indicating the result of the logout process.
- **Success Response Example:**
  ```json
  {
    "status": "success",
    "msg": "User logged out successfully"
  }


### Reset Password

#### `users/resetpassword` (POST)

- **Description:** Reset the password for an existing user.
- **Method:** POST
- **Request Body:**
  - `email`: String (required) - The email address of the user.
  - `oldPassword`: String (required) - The old password of the user.
  - `newPassword`: String (required) - The new password to set for the user account.
- **Request Headers:**
  - `Content-Type: application/json`
- **Response:**
  - `status`: String (Success/Error) - Status of the password reset process.
  - `msg`: String - Additional message indicating the result of the password reset process.
- **Success Response Example:**
  ```json
  {
    "status": "success",
    "msg": "Your password changed successfully"
  }


### OTP Functions and Route

#### `generateFourDigitOTP`

- **Description:** Generate a 4-digit random OTP (One-Time Password).
- **Parameters:** None
- **Returns:** String - A 4-digit random OTP.


### saveOTPToUserDocument
- **Description** Update the OTP in the user document in the database.
- **Parameters**:
- **userId**: String (required) - The ID of the user document to update.
- **otp**: String (required) - The OTP to save in the user document.
- **Returns**: Promise - Resolves when the OTP is successfully saved to the


### /users/ottRequest (POST)
- **Description**: Request to send an OTP to a user's email for verification.
- **Method**: POST
- **Request Body**:
- **email**: String (required) - The email address of the user.
- **Request** Headers:
- **Content-Type**: application/json
- **Response**:
- **status**: String (Success/Error) - Status of the OTP request.
- **msg**: String - Additional message indicating the result of the OTP request.
### Notes:
- This route triggers the generation of a 4-digit OTP and sends it to the user's email address using Nodemailer.
- The generated OTP is also saved to the user's document in the database.


### OTP Verification

#### `/users/otpVerify` (POST)

- **Description:** Verify the OTP (One-Time Password) sent to a user's email for verification.
- **Method:** POST
- **Request Body:**
  - `email`: String (required) - The email address of the user.
  - `otp`: String (required) - The OTP entered by the user for verification.
- **Request Headers:**
  - `Content-Type: application/json`
- **Response:**
  - `status`: String (Success/Error) - Status of the OTP verification process.
  - `msg`: String - Additional message indicating the result of the OTP verification process.
- **Success Response Example:**
  ```json
  {
    "status": "success",
    "msg": "OTP verified successfully"
  }



### Forget Password

#### `users/forgotPassword` (POST)

- **Description:** Reset the password for a user who has forgotten their password.
- **Method:** POST
- **Request Body:**
  - `email`: String (required) - The email address of the user.
  - `newPassword`: String (required) - The new password to set for the user account.
- **Request Headers:**
  - `Content-Type: application/json`
- **Response:**
  - `status`: String (Success/Error) - Status of the password reset process.
  - `msg`: String - Additional message indicating the result of the password reset process.
- **Success Response Example:**
  ```json
  {
    "status": "success",
    "msg": "Password reset successfully"
  }

### Products routes



### Get All Products

#### `/products` (GET)

- **Description:** Retrieve all products from the database.
- **Method:** GET
- **Query Parameters:** (Optional)
  - `category`: String - Filter products by category.
  - Other query parameters can be used to filter products based on specific attributes.
- **Response:**
  - `status`: String (Success/Error) - Status of the retrieval process.
  - `msg`: String - Additional message indicating the result of the retrieval process.
  - `data`: Object - Data returned containing:
    - `products`: Array - Array of product objects retrieved from the database.
- **Success Response Example:**
  ```json
  {
    "status": "success",
    "msg": "Get all products data",
    "data": {
      "products": [
        {
          "_id": "6094d196c7e85b75bc493e4a",
          "price": 25.99,
          "subtitle": "Example Product",
          "shortDescription": "This is an example product description.",
          "category": "Electronics",
          "productImage": "https://example.cloudinary.com/path/to/product-image.jpg",
        },
        // Additional product objects...
      ]
    }
  }


### Create Product (Admin Only)

#### `/products/create` (POST)

- **Description:** Add a new product to the database. This route is accessible only to administrators.
- **Method:** POST
- **Request Body:**
  - `price`: Number (required) - The price of the product.
  - `subtitle`: String (required) - A short subtitle or title for the product.
  - `shortDescription`: String (required) - A brief description of the product.
  - `category`: String (required) - The category of the product.
- **Request File:**
  - `productImage`: Image file (required) - The image representing the product.
- **Response:**
  - `status`: String (Success/Error) - Status of the product creation process.
  - `msg`: String - Additional message indicating the result of the product creation process.
  - `data`: Object - Data returned upon successful product creation, containing:
    - `productDetails`: Object - Details of the newly created product.
- **Success Response Example:**
  ```json
  {
    "status": "success",
    "msg": "Product added successfully",
    "data": {
      "productDetails": {
        "_id": "6094d196c7e85b75bc493e4a",
        "price": 25.99,
        "subtitle": "Example Product",
        "shortDescription": "This is an example product description.",
        "category": "Electronics",
        "productImage": "https://example.cloudinary.com/path/to/product-image.jpg",
      }
    }
  }



### /products/:id/update (PATCH)
- **Description**: Update an existing product in the database. This route is accessible only to administrators.
- **Method**: PATCH
- **Path Parameters**:
- **id**: String (required) - The ID of the product to update.
- **Request Body**: Object containing the updated details of the product.
- **Response**:
- **status**: String (Success/Error) - Status of the product update process.
- **msg**: String - Additional message indicating the result of the product update process.
- **data**: Object - Data returned upon successful product update, containing:
- **products**: Object - Updated details of the product.
- **Success Response Example:**
{
  "status": "success",
  "msg": "Product updated successfully",
  "data": {
    "products": {
      "_id": "6094d196c7e85b75bc493e4a",
      "price": 29.99,
      "subtitle": "Updated Product",
      "shortDescription": "This is an updated product description.",
      "category": "Electronics",
      "productImage": "https://example.cloudinary.com/path/to/updated-product-image.jpg", 
    }
  }
}

### `/products/:id/delete` (DELETE)
- **Description**: Delete a product from the database. This route is accessible only to administrators.
- **Method**: DELETE
- **Path Parameters**:
- **id**: String (required) - The ID of the product to delete.
- **Response**:
- **status**: String (Success/Error) - Status of the product deletion process.
- **msg**: String - Additional message indicating the result of the product deletion process.
- **data**: Object - Data returned upon successful product deletion, containing:
- **findDataToDelete**: Object - Details of the deleted product.
- **Success Response Example:**

{
  "status": "success",
  "msg": "Product deleted successfully",
  "data": {
    "findDataToDelete": {
      "_id": "6094d196c7e85b75bc493e4a",
      "price": 29.99,
      "subtitle": "Updated Product",
      "shortDescription": "This is an updated product description.",
      "category": "Electronics",
      "productImage": "https://example.cloudinary.com/path/to/updated-product-image.jpg",
    
    }
  }
}



### Authorization Middleware

#### `auth`

- **Description:** Middleware function for authenticating user requests using JWT tokens.
- **Usage:** This middleware should be applied to routes that require authentication.
- **Functionality:**
  - Verifies the access token provided in the request cookies.
  - Checks if the access token is blacklisted (revoked).
  - If the access token is expired, it verifies the refresh token and generates a new access token.
- **Request Headers:**
  - `Cookie: access_token` - The access token cookie containing the JWT token.
  - `Cookie: refresh_token` - The refresh token cookie containing the JWT token.
- **Response:**
  - If authentication succeeds, the middleware adds the `user` object to the request containing the decoded user information.
  - If authentication fails due to expired tokens or other errors, appropriate error responses are sent.
- **Error Response Example (Token Blacklisted):**
  ```json
  {
    "status": "fail",
    "msg": "Token is blacklisted, please login again"
  }




  ### Get User Cart Data

#### `/cart` (GET)

- **Description:** Retrieve all cart data for the authenticated user.
- **Method:** GET
- **Authorization Required:** Yes
- **Request Headers:**
  - `Cookie: access_token` - The access token cookie containing the JWT token.
  - `Cookie: refresh_token` - The refresh token cookie containing the JWT token.
- **Response:**
  - `status`: String (Success/Error) - Status of the retrieval process.
  - `msg`: String - Additional message indicating the result of the retrieval process.
  - `userProduct`: Array - Array of cart data for the authenticated user.
- **Success Response Example:**
  ```json
  {
    "status": "success",
    "msg": "User cart data retrieved successfully",
    "userProduct": [
      {
        "_id": "6094d196c7e85b75bc493e4a",
        "userId": "6094d196c7e85b75bc493e4b",
        "productId": "6094d196c7e85b75bc493e4c",
        "isRemove": false,
        "productInfo": {
          "_id": "6094d196c7e85b75bc493e4c",
          "price": 25.99,
          "subtitle": "Example Product",
          "shortDescription": "This is an example product description.",
          "category": "Electronics",
          "productImage": "https://example.cloudinary.com/path/to/product-image.jpg",
        }
      },
      // Additional cart data objects...
    ]
  }




### Add Product to User Cart

#### `/cart/addToCart` (POST)

- **Description:** Add a product to the authenticated user's cart.
- **Method:** POST
- **Authorization Required:** Yes
- **Request Headers:**
  - `Cookie: access_token` - The access token cookie containing the JWT token.
  - `Cookie: refresh_token` - The refresh token cookie containing the JWT token.
- **Request Body:**
  - `productId`: String (required) - The ID of the product to add to the cart.
- **Response:**
  - `status`: String (Success/Error) - Status of the product addition process.
  - `msg`: String - Additional message indicating the result of the product addition process.
  - `productData`: Object - Data returned upon successful addition of the product to the cart.
- **Success Response Example:**
  ```json
  {
    "status": "success",
    "msg": "Product added to cart successfully",
    "productData": {
      "_id": "6094d196c7e85b75bc493e4a",
      "userId": "6094d196c7e85b75bc493e4b",
      "productId": "6094d196c7e85b75bc493e4c",
      "isRemove": false,
    }
  }


### Delete Product from User Cart

#### `/cart/deleteCart` (POST)

- **Description:** Remove a product from the authenticated user's cart.
- **Method:** POST
- **Authorization Required:** Yes
- **Request Headers:**
  - `Cookie: access_token` - The access token cookie containing the JWT token.
  - `Cookie: refresh_token` - The refresh token cookie containing the JWT token.
- **Request Body:**
  - `productId`: String (required) - The ID of the product to remove from the cart.
- **Response:**
  - `status`: String (Success/Error) - Status of the product deletion process.
  - `msg`: String - Additional message indicating the result of the product deletion process.
  - `deletedProduct`: String - ID of the product that was deleted from the cart.
- **Success Response Example:**
  ```json
  {
    "status": "success",
    "msg": "Product deleted from cart successfully",
    "deletedProduct": "6094d196c7e85b75bc493e4c"
  }

### Multer Middleware

#### File Upload

- **Description:** Middleware for handling file uploads, particularly useful for uploading images or other files.
- **Usage:** This middleware is used to configure and handle file uploads in your application.
- **Installation:** Multer can be installed via npm or yarn:


### Cloudinary Utility

#### File Upload to Cloudinary

- **Description:** Utility function for uploading files to Cloudinary, a cloud-based media management service.
- **Usage:** This utility function is used to upload files to Cloudinary for storage and management.
- **Installation:** Cloudinary SDK can be installed via npm or yarn:

- **Configuration:**
- Ensure that you have a Cloudinary account and obtain the necessary credentials (cloud name, API key, and API secret).
- Set up environment variables or configure a `.env` file to store these credentials securely.
- **Example Configuration:**
- Ensure that the `.env` file contains the following environment variables:
  ```
  CLOUD_NAME=your_cloud_name
  API_KEY=your_api_key
  API_SECRET=your_api_secret
  ```
- **Usage:**
- Call the `uploadOnCloudinary` function with the local file path as the argument to upload the file to Cloudinary.
- Upon successful upload, the function returns the Cloudinary response containing details about the uploaded file.


