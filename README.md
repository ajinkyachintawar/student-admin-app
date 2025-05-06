# Student Administration App

A simple web-based Student Administration system built using **React**, **Supabase (PostgreSQL)**, and hosted on **Netlify**.

## 🌐 Live Demo

👉 [https://student-administration.netlify.app](https://student-administration.netlify.app)

---

## 🔧 Features

- Add new student records
- Edit existing student details
- Delete student records
- Backend connected to Supabase (PostgreSQL)
- Fully responsive and deployed on Netlify

---

## 🛠️ Tech Stack

- [React](https://reactjs.org/)
- [Supabase](https://supabase.com/) (Database & API)
- [Netlify](https://netlify.com/) (Hosting)
- Plain CSS

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ajinkyachintawar/student-admin-app.git
cd student-admin-app
```
### 2. Install dependencies

```bash
npm install
```
### 3. Create .env file
Create a .env file in the root folder and add:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
### 4. Run the app locally

```bash
npm run dev
```
### 🧩 Database Schema
| Column | Type    | Description                  |
| ------ | ------- | ---------------------------- |
| id     | bigint  | Primary key (auto-increment) |
| name   | text    | Student name                 |
| age    | integer | Student age                  |
| course | text    | Course enrolled              |

### 📦 Deployment
This project is deployed on Netlify. To deploy your own:

1. **Push the project to GitHub.**
2. **Connect your GitHub repository to Netlify.**
3. **Set environment variables in the Netlify dashboard:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Build command:** `npm run build`
5. **Publish directory:** `dist`

### 👨‍💻 Author
#### Ajinkya Chintawar


