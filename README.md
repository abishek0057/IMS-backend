# Inventory Management System APIs

### User Management:
- User registration with name, email, and password.
- User login with registered email and password.
- Retrieval of information about the currently logged-in user.
- Check if a user is logged in or not.
- User logout functionality.
- Update user information including name, phone, bio, and photo.
- Change user password with the requirement of the old password.
- Forgot password functionality that sends a reset link to the user's registered email.
- Password reset using the token received from the reset link email.

### Product Management:
- Adding a new product with fields such as name, category, SKU, quantity, price, description, and image.
- Updating a product's information, allowing all fields or specific ones.
- Retrieval of all products associated with the logged-in user.
- Retrieval of detailed information about a specific product.
- Deletion of a product from the database.

### Contacting Admin:
- Users can contact the system administrator.
- Users can provide a subject (issue/enquiry topic) and a descriptive message.


# Endpoints

## Endpoints for user management 
This endpoints are used to manage the user for the system. dedicated to user management functionalities.

| Endpoints                      | HTTP Method | Request Data Structure                                    | Remark                                                |
|--------------------------------|-------------|-----------------------------------------------------------|-------------------------------------------------------|
| api/user/register              | POST        | {"name": "user name",<br>"email": "user email",<br>"password": "user password"}| Need name, email, and password for registration|
| api/user/login                 | POST        | {"email": "registered email",<br>"password": "password"}| Need registered email and password for login           |
| api/user/getuser               | GET         | none                                                      | Return information about the current logged-in user   |
| api/user/isloggedin            | GET         | none                                                      | Protected route; login is required. Return a Boolean value whether the user is logged in Return a Boolean value whether the user is logged in or not                 |
| api/user/logout                | GET         | none                                                      | Logout the user                                       |
| api/user/update                | PATCH       | { name: new name,<br>phone: new phone,<br>bio: new bio,<br>photo: image file}| Update the user information; requires multipart form name field used is "photo". Login required. |
| api/user/changepassword        | PATCH       | {"oldPassword": "old password",<br>"password": "new password"}| Change login password; old password is required. This route requires login.|
| api/user/forgotpassword        | POST        | {"email": "registered email"}| Send an email with a password reset link containing   |
| api/user/resetpassword/{token} | PUT         | {"password": "new password"}| Use the link sent by forgotpassword route to reset password. This URL is received in email with token.|


## Endpoints for product management
These routes are used to manage all the product associated to the registred in user
| Endpoints                      | HTTP Method | Request Data Structure                                         | Remark                                                |
|--------------------------------|-------------|----------------------------------------------------------------|-------------------------------------------------------|
| api/user/register              | POST        | {"name": "user name", "email": "user email", "password": "user password"} | Need name, email, and password for registration      |
| api/user/login                 | POST        | {"email": "registered email", "password": "password"}           | Need registered email and password for login           |
| api/user/getuser               | GET         | none                                                           | Return information about the current logged-in user   |
| api/user/isloggedin            | GET         | none                                                           | Protected route; login is required. Return a Boolean value whether the user is logged in or not |
| api/user/logout                | GET         | none                                                           | Logout the user                                       |
| api/user/update                | PATCH       | { name: new name, phone: new phone, bio: new bio, photo: image file } | Update the user information; requires multipart form data; name field used is "photo". This route requires login. |
| api/user/changepassword        | PATCH       | {"oldPassword": "old password", "password": "new password"}     | Change login password; old password is required. This route requires login. |
| api/user/forgotpassword        | POST        | {"email": "registered email"}                                   | Send an email with password reset link containing   |
| api/user/resetpassword/{token} | PUT         | {"password": "new password"}                                    | Use the link sent by forgot password route to reset password; this URL is received in email with token. |


## Endpoints for contacting admin
This section covers the API endpoint that facilitates users in contacting the system administrator.
| Endpoints                   | HTTP Method | Request Data Structure                                                | Remark                                                     |
|-----------------------------|-------------|-----------------------------------------------------------------------|------------------------------------------------------------|
| api/product                 | POST        | {<br>name: product name,<br>category: product category,<br>sku: product sku,<br>quantity: quantity,<br>price: item price,<br>description: product description,<br>image: product image<br>} | All fields are required, name for image input is "image"    |
| api/product/{productId}    | PATCH       | {<br>name: product name,<br>category: product category,<br>sku: product sku,<br>quantity: quantity,<br>price: item price,<br>description: product description,<br>image: product image<br>} | Update the product information, All the fields at once or individual fields can be updated |
| api/product                 | GET         | none                                                                  | Get all the products associated with the logged-in user     |
| api/product/{productId}    | GET         | none                                                                  | Get the complete details about the product                  |
| api/product/{productId}    | DELETE      | None                                                                  | Remove the item from the database                           |

*This project is part of the final year project*





