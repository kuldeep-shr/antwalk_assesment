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
        "magic_link_url": "http://localhost:8000/api/validate?email=shivam@email.com&link=f443a6021f500ff274cdaaa3b38d8e864d91497c"
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
        "link": "2a470b5be42d75e20be3820b6c068dab1fefd333",
        "magic_link_url": "http://localhost:8000/api/validate?email=shivam@email.com&link=2a470b5be42d75e20be3820b6c068dab1fefd333",
        "magic_link_expires": "2024-06-09T11:30:06.736Z"
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

#### 🆕&nbsp; Create a todo

- **URL:** `/todo`
- **Method:** `POST`
- **Body:**

  ```json
  {
    "title": "Market Research Analysis",
    "description": "Review and analyze market research data to identify new opportunities.",
    "status": "completed",
    "priority": "medium",
    "due_date": "2024-07-02"
  }
  ```

- **Response:**
  ```json
  {
    "status": "success",
    "message": "todo is created",
    "data": {
      "todo_id": 7,
      "title": "Market Research Analysis",
      "description": "Review and analyze market research data to identify new opportunities.",
      "status": "completed",
      "priority": "medium",
      "due_date": "2024-07-01T18:30:00.000Z"
    },
    "statusCode": 201
  }
  ```

<br />

#### 🔄 &nbsp; Update a todo

- **URL:** `/todo/7`
- **Method:** `PUT`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer eyJhbGcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXkWL6E`
- **Body:**

  ```json
  {
    "title": "updating todo",
    "description": "mono",
    "priority": "high"
  }
  ```

- **Response:**

  ```json
  {
    "status": "success",
    "message": "todo is updated successfully",
    "data": [
      {
        "id": 7,
        "title": "updating todo",
        "description": "mono",
        "priority": "high",
        "status": "completed",
        "user_id": 1,
        "created_at": "2024-06-09T08:10:30.757Z",
        "updated_at": "2024-06-09T14:22:36.850Z"
      }
    ],
    "statusCode": 200
  }
  ```

- **NOTE:** In this API, you can update single entity to multiple entities. these entities you can edit `title`&nbsp;,`description`&nbsp;,`priority`&nbsp;,`status`

<br />

#### 📋&nbsp; Todo List

#### Get Specific Todo

- **URL:** `/todo/3`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer eyJhbXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXWL6E`
- **Response:**

  ```json
  {
    "status": "success",
    "message": "todo list",
    "data": {
      "data": [
        {
          "id": 3,
          "user_id": 1,
          "title": "communication workshop",
          "description": "Arrange a workshop to enhance team communication skills, including active listening and conflict resolution.",
          "status": "inprogress",
          "priority": "medium",
          "due_date": "2024-08-09T18:30:00.000Z",
          "created_at": "2024-06-09T08:09:45.243Z",
          "updated_at": "2024-06-09T08:09:45.243Z"
        }
      ]
    },
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
        "id": 1,
        "user_id": 6,
        "title": "team building activity",
        "description": "Organize team outing, coordinate logistics, and ensure smooth execution.",
        "status": "inprogress",
        "priority": "medium",
        "due_date": "2024-06-29T18:30:00.000Z",
        "created_at": "2024-06-09T07:53:31.273Z",
        "updated_at": "2024-06-09T07:53:31.273Z"
      },
      {
        "id": 2,
        "user_id": 6,
        "title": "Employee Training Program",
        "description": "Organize a training program for new employees covering company policies and procedures.",
        "status": "inprogress",
        "priority": "medium",
        "due_date": "2024-07-04T18:30:00.000Z",
        "created_at": "2024-06-09T08:09:23.916Z",
        "updated_at": "2024-06-09T08:09:23.916Z"
      }
    ],
    "statusCode": 200
  }
  ```

<br />

#### ❌ &nbsp;Delete Todo

- **URL:** `/todo/7`
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
        "id": 7,
        "user_id": 6,
        "title": "updating todo",
        "description": "mono",
        "status": "inprogress",
        "priority": "high",
        "due_date": "2024-07-01T18:30:00.000Z",
        "created_at": "2024-06-09T08:10:30.757Z",
        "updated_at": "2024-06-09T14:22:36.850Z"
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
