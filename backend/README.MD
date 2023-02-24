<h1>Book Management REST API</h1>
<p>
  This is a REST API for managing books, users, and orders. It was built with
  Node.js, Express, and MongoDB, and provides endpoints for creating, updating,
  and deleting books and users, as well as placing orders.
</p>
<h1>Features</h1>
<ul>
  <li>CRUD operations for books</li>
  <li>CRUD operations for users</li>
  <li>Ability to place orders</li>
  <li>Authentication using JWT</li>
  <li>Validation using Joi</li>
  <li>Password reset and email verification</li>
</ul>

<h1>Technologies Used</h1>
<ul>
  <li>Node.js</li>
  <li>Express.js</li>
  <li>MongoDB</li>
  <li>JWT</li>
  <li>Joi</li>
</ul>

<h1>Endpoints</h1>
<h1>Books</h1>
<ul>
  <li>GET /api/books - Get all books</li>
  <li>POST /api/books - Create a new book</li>
  <li>PATCH /api/books/:id - Update a book by ID</li>
  <li>DELETE /api/books/:id - Delete a book by ID</li>
  <li>GET /api/books/search - Search Books With Diffrent Parameter</li>
  <li>GET /api/books/user - Get Books With Specific User</li>
</ul>

<h1>Users</h1>
<ul>
  <li>POST /api/users - Create a new user</li>
  <li>POST /api/users/login - Login with email and password<</li>
  <li>PATCH /api/users/profile - Update User</li>
  <li>DELETE /api/users/account - Delete a user</li>
</ul>

<h1>Orders</h1>
<ul>
  <li>GET /api/orders - Get all orders</li>
  <li>POST /api/orders - Place a new order</li>
  <li>PATCH /api/orders/:orderId - Update an order by ID</li>
  <li>DELETE /api/orders/:orderId - Delete an order by ID</li>
</ul>

<h1>Authentication</h1>

<ul>
  <li>POST /api/auth/forgotpassword - Send a password reset email</li>
  <li>POST /api/auth/resetpassword/:token - Reset password with token</li>
  <li>POST /api/auth/verifyemail/:token - Verify email with token</li>
</ul>

<h1>License</h1>
<p>
  This project is licensed under the MIT License - see the LICENSE file for
  details.
</p>
