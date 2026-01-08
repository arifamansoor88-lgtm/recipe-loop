# Recipe Loop

RecipeLoop is a **full-stack web application** that lets users share their personal cooking journey by posting recipes they’ve made from around the web. Users document what they cooked, how it turned out, and where the original recipe came from.

This project is currently an **MVP** and is under active development.

---

## Features 

- User authentication (register / login)
- Create recipe posts with:
  - Title
  - Image upload
  - Caption describing the cooking experience
  - Optional original recipe source link
  - Rating
- Personalized feed showing recipes from users you follow
- Follow / unfollow users
- Suggested users to follow
- Profile pages with follower & following counts
- Social-style, image-focused feed layout

---

## Tech Stack

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL

### Frontend
- React
- Next.js

### Other
- JWT-based authentication 
- Multer for image uploads

---

## Screenshots
<img width="400" height="300" alt="image" src="https://github.com/user-attachments/assets/faeb92aa-8d1c-46c1-8e8b-109e1f8e187e" />
<img width="400" height="403" alt="image" src="https://github.com/user-attachments/assets/0a706e3f-cbc2-4a66-bffe-18e3ae49e96f" />
<img width="600" height="300" alt="image" src="https://github.com/user-attachments/assets/88f72b1f-316a-40e6-b4de-45a42949ea13" />
<img width="200" height="600" alt="image" src="https://github.com/user-attachments/assets/1601fbbf-6405-4c59-ae57-0bbd60b3b3b3" />
<img width="600" height="400" alt="image" src="https://github.com/user-attachments/assets/ae894513-5df6-4315-8bba-5e723dc9426c" />
<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/abf026f0-51d5-4422-a58f-adbd065993eb" />


---

## Local Setup

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL
- npm

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/recipe-loop.git
cd recipe-loop
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend/frontend
npm install
npm run dev
```
