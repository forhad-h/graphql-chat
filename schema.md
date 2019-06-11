User -hasMany -> chat -hasMany -> Message

User
- _id: ObjectId
- name: String
- email: String
- username: String
- password: String
- chats: [ObjectId] -> Chat
- createdAt: Date
- updatedAt: Date

Chat
- _id: ObjectId
- title: String
- users: [ObjectId] -> User
- lastMessage: ObjectId -> Message
- createdAt: Date
- updatedAt: Date

Message
- _id: ObjectId
- body: String
- sender: ObjectId -> User
- chat: ObjectId -> Chat
- updatedAt: Date
- createdAt: Date