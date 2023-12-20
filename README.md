# AuthenticationApp
Authentication APP (Express, MongoDB, Node, Typescript)

1) Creating an account:
POST http://localhost:8080/auth/register
{
    "email": "",
    "password": "",
    "username": ""
}

2) Login:
POST http://localhost:8080/auth/login
{
    "email": "",
    "password": ""
}

3) Get users data:
GET http://localhost:8080/users

4) Delete user data:
DELETE http://localhost:8080/users/<user_id>

5) Update user data
PATCH http://localhost:8080/users/<user_id>
