# Vid Chat Backend

**How to run in local?**

1. Clone the repo using:
2. Run the command in root:  `yarn` OR `npm install`
3. Create .env file in the root and paste the your secrets as described in *env.example* in there.
4. To run the backend: `yarn dev` OR `npm run dev`
5. To build: `yarn build` OR `npm run build`
6. To start the build: `yarn start:build` OR `npm run start:build`
7. To build the backend and start: `yarn build:start` OR `npm run build:start`


# Folder structure
```
.
├── node_modules/
├── @types/
│   └── types.d.ts                                  - this file contains types used in whole app
└── configs/
│    ├── aws.ts                                      - this file contains aws configurations
│    ├── db.ts                                       - this file contains db connection logic
│    └── env.ts                                      - this file contains all envs read from .env
└── context/
│    └── index.ts                                    - this file contains users list connected to socket
│                                                      and the functions to manipulate that list
└── controllers/                                     - this contains all the controllers
│    ├── auth.controller.ts
│    ├── aws-upload.controller.ts
│    ├── chat.controller.ts
│    └── user.controller.ts
└── middlewares/
│    └── auth.middleware.ts                          - middleware to check athorization of the user
└── models/                                          - mongoose models
│    ├── chat.model.ts
│    ├── message.model.ts
│    ├── user.model.ts
│    └── types.d.ts
└── routes/                                          - contains all routes
│    ├── auth.route.ts
│    ├── aws-upload.route.ts
│    ├── chat.route.ts
│    └── user.route.ts
└── utils/                                           - contains all utility functions
│    ├── jwt.ts
│    └── response.ts
└── index.ts                                         - ROOT OF THE APP
```

# REST API Documentation

**Response structure:**
```
{
  data?: any;
  error?: string;
  message?: string;
  token?: string;
  statusCode?: number;
}
```

1. Auth end points:
   - **POST**: api/auth/sign-up
     - Body structure:
       ```
       {
          "username": "Username",
          "email": "email@example.com",
          "password": "Password@123"
       }
       ```
   - **POST**: api/auth/sign-in
     - Body structure:
       ```
       {
          "email": "email@example.com",
          "password": "Password@123"
       }
       ```
   - **POST**: api/auth/sign-out
     - Body structure:
       ```
       {
          "email": "email@example.com",
          "password": "Password@123"
       }
       ```
2. AWS file upload end points:
   - **POST**: api/file/upload
     - multipart/form-data structure:
       ```
       file: <pdf, png, jpeg, jpg, gif> & <= 3MB
       ```
   - **DELETE**: api/file/delete
     - Body structure:
       ```
       {
          "email": "email@example.com",
          "password": "Password@123"
       }
       ```
3. Chat end points
   - **GET**: /api/chats/
   - **GET**: /api/chats/conversation/:userId
   - **POST**: api/chats/message/:userId
       - Body structure:
         ```
           {
              "message": "How are you?"
           }
         ```
   - **PATCH**: api/chats/message/:messageId
       - Body structure:
         ```
           {
              "message": "How are you?"
           }
         ```
   - **DELETE**: api/chats/message/:messageId
4. User end points
   - **GET**: /api/users/
     - query structure:
         -  ?key=<username_or_email_to_search_user>
   - **GET**: /api/users/me
   - **PATCH**: api/users/update/
       - Body structure:
         ```
           {
              "email"?:"email@example.com"
              "username"?:"Username123"
              "password"?:"Password@123"
              "avatar"?:"link_to_avatar"
            }
         ```
