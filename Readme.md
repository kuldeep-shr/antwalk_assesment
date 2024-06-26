# 📝 To-Do Backend API

Welcome to the To-Do Backend API! This API allows you to manage your to-do lists with ease. It includes user authentication to ensure your data is secure. Below, you'll find all the details on how to get started and use the API effectively.

---

<br />

## 🌟 Features

- 🔒 User Authentication (Register)
- 📋 Manage To-Do Items (CRUD operations)
- 🔍 Search and Filter To-Do Items

---

<br />

## 🛠️ Built With

- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Database**: Postgres SQL.
- **nodemon**: Tool for automatically restarting the server when changes are made to the code.
- **mocha,chai**: Testing libraries

---

<br />

## 🚀 Getting Started

### 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kuldeep-shr/antwalk_assesment
   ```

2. **Install dependencies by using these commands:**

   ```bash

   1. npm install
   2. npm run create-table
   ```

3. **Start the server:**

   ```bash
    npm start
   ```

---

<br />

## ✅ For Test Cases

Run `npm test`

---

 <br/>

## ⚙️ Configuration

Create a .env file in the root directory and add your configuration variables:

```bash
1. PORT             #server port to listen
2. DB_CONNECTION    #I used cloud postgres
3. TABLE_USER       #name the table for user
4. TABLE_TODO       #name the table for todo
5. SECRET_KEY       #jwt secret key
6. EMAIL_FROM       #your smtp configurations 1
7. EMAIL_PORT       #your smtp configurations 2
8. EMAIL_PWD        #your smtp configurations 3
9. EMAIL_HOST       #your smtp configurations 4
10. MAGIC_LINK_URL  #localhost path for ex: http://localhost:XXXX/api

```

---

<br/>

## 📚 API Documentation

#### Endpoints:

**NOTE:** Prefix URL `http:localhost:XXXX/api`

#### 💁‍♂️&nbsp; Create a User

- **URL:** `/register`
- **Method:** `POST`
- **Body:**

  ```json
  {
    "name": "Shivam",
    "email": "shivam@email.com"
  }
  ```

- **Response:**
  ```json
  {
    "status": "success",
    "message": "user created successfully and check your email for magic link",
    "data": [
      {
        "id": 6,
        "email": "shivam@email.com",
        "name": "Shivam",
        "created_at": "2024-06-09T11:13:42.947Z",
        "updated_at": "2024-06-09T11:13:42.947Z",
        "magic_link_url": "http://localhost:8000/api/validate?email=shivam@email.com&link=f44XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1497c"
      }
    ],
    "statusCode": 201
  }
  ```

<br />

#### 💁‍♂️&nbsp; User Login

- **URL:** `/login`
- **Method:** `POST`
- **Body:**

  ```json
  {
    "email": "shivam@email.com"
  }
  ```

- **Response:**
  ```json
  {
    "status": "success",
    "message": "please check your email for magic link",
    "data": [
      {
        "magic_link_url": "http://localhost:8000/api/validate?email=shivam@email.com&link=93XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXe954"
      }
    ],
    "statusCode": 200
  }
  ```

<br />

#### 🔗&nbsp; Magic Link validation

- **URL:** `/validate?email=shivam@email.com&link=4b0c385bf41cefb7ef286d2df4e6c188f8f3524e`
- **Method:** `GET`
- **Query Parameters:**

  - `email`: The email address to validate.
  - `link`: The validation token.

- **Response:**
  ```json
  {
    "status": "success",
    "message": "magic link is correct",
    "data": [
      {
        "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJzaGl2YW1AZW1haWwuY29tIiwiaWF0IjoxNzE3OTMyMTIwLCJleHAiOjE3MTgwMTg1MjB9.IE5e048x5i1J6BPhZ5DVdLcVCXIVIDiqCo3YjF0Mu5o"
      }
    ],
    "statusCode": 200
  }
  ```

<br />

#### 👴✏️&nbsp; Update User API

- **URL:** `/users/${userId}`
- **Method:** `PUT`
- **Body:**

  ```json
  {
    "name": "Shiva"
  }
  ```

- **Response:**
  ```json
  {
    "status": "success",
    "message": "user updated successfully",
    "data": [
      {
        "id": 6,
        "name": "Shiv",
        "email": "shivam@email.com",
        "created_at": "2024-06-09T11:13:42.947Z",
        "updated_at": "2024-06-10T03:34:21.518Z"
      }
    ],
    "statusCode": 200
  }
  ```

#### 🆕&nbsp; Create a todo

- **URL:** `/todo`
- **Method:** `POST`
- **Body:**

  ```json
  {
    "title": "Cycling task",
    "description": "wake up and go for the long race",
    "status": "todo",
    "priority": "high",
    "due_date": "2024-11-01"
  }
  ```

- **Response:**
  ```json
  {
    "status": "success",
    "message": "todo is created",
    "data": [
      {
        "todo_id": 8,
        "title": "Cycling task",
        "description": "wake up and go for the long race",
        "status": "todo",
        "priority": "high",
        "due_date": "2024-10-31T18:30:00.000Z"
      }
    ],
    "statusCode": 201
  }
  ```

<br />

#### 🔄 &nbsp; Update a todo

- **URL:** `/todo/16`
- **Method:** `PUT`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer eyJhbGcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXkWL6E`
- **Body:**

  ```json
  {
    "title": "Write Good Test Cases",
    "due_date": "2024-12-01",
    "status": "todo",
    "priority": "medium"
  }
  ```

- **Response:**

  ```json
  {
    "status": "success",
    "message": "todo is updated successfully",
    "data": [
      {
        "todo_id": 16,
        "title": "Write Good Test Cases",
        "description": "always write test case for better testing",
        "priority": "medium",
        "due_date": "2024-11-30T18:30:00.000Z",
        "status": "todo",
        "user_id": 32,
        "created_at": "2024-06-10T04:53:23.690Z",
        "updated_at": "2024-06-10T05:03:04.671Z"
      }
    ],
    "statusCode": 200
  }
  ```

- **NOTE:** In this API, you can update single entity to multiple entities. these entities you can edit `title`&nbsp;,`description`&nbsp;,`priority`&nbsp;,`status`

<br />

#### 📋&nbsp; Todo List

#### Get Specific Todo

- **URL:** `/todo/18`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer eyJhbXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXWL6E`
- **Response:**

  ```json
  {
    "status": "success",
    "message": "todo list",
    "data": [
      {
        "todo_id": 18,
        "user_id": 34,
        "title": "Stop Phone",
        "description": "I will not use my phone always because of so many problems",
        "status": "todo",
        "priority": "high",
        "due_date": "2024-11-01T18:30:00.000Z",
        "created_at": "2024-06-10T05:13:15.111Z",
        "updated_at": "2024-06-10T05:13:15.111Z"
      }
    ],
    "statusCode": 200
  }
  ```

#### Get Todos

- **URL:** `/todo`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer eyJhbXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXWL6E`
- **Query Parameters:**
  - `status`: Filter by todo status (e.g., `inprogress`)
  - `priority`: Filter by todo priority (e.g., `medium|low|high`)
  - `title`: Filter by todo title (e.g., `employee`)
  - `description`: Filter by todo description (e.g., `a`)
  - `page`: Page number for pagination (e.g., `1`)
  - `limit`: Number of items per page (e.g., `5`)
  - `sortBy`: Sort by field (e.g., `priority`)
  - `sortDirection`: Sort direction (e.g., `asc`)
- **Response:**
  ```json
  {
    "status": "success",
    "message": "todo list",
    "data": [
      {
        "todo_id": 18,
        "user_id": 34,
        "title": "Stop Phone",
        "description": "I will not use my phone always because of so many problems",
        "status": "todo",
        "priority": "high",
        "due_date": "2024-11-01T18:30:00.000Z",
        "created_at": "2024-06-10T05:13:15.111Z",
        "updated_at": "2024-06-10T05:13:15.111Z"
      },
      {
        "todo_id": 19,
        "user_id": 34,
        "title": "No Outside Food",
        "description": "I will not eat outside food as much as I always had",
        "status": "todo",
        "priority": "high",
        "due_date": "2024-11-01T18:30:00.000Z",
        "created_at": "2024-06-10T05:15:48.009Z",
        "updated_at": "2024-06-10T05:15:48.009Z"
      }
    ],
    "statusCode": 200
  }
  ```

<br />

#### ❌ &nbsp;Delete Todo

- **URL:** `/todo/22`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization: Bearer eyJXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXo95E`
- **Response:**
  ```json
  {
    "status": "success",
    "message": "todo deleted successfully",
    "data": [
      {
        "todo_id": 22,
        "user_id": 37,
        "title": "Write Good Test Cases",
        "description": "always write test case for better testing",
        "status": "todo",
        "priority": "medium",
        "due_date": "2024-11-30T18:30:00.000Z",
        "created_at": "2024-06-10T06:30:38.055Z",
        "updated_at": "2024-06-10T06:30:39.209Z"
      }
    ],
    "statusCode": 200
  }
  ```

---

<br />

## 🏫&nbsp;For API Documentation and API collections:

Hit below button <br />

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/30468072-7a5de737-59e3-483d-b3e1-a677295065da?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D30468072-7a5de737-59e3-483d-b3e1-a677295065da%26entityType%3Dcollection%26workspaceId%3D5bee838e-3bf4-4fea-bdbb-c1a9c11b29f8)
