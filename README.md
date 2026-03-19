# 🛠️ Akiba-Link

**Akiba-Link** is a modern, community-driven platform designed to connect neighbors so they can borrow, share, and request tools. Why buy an expensive power drill or a lawnmower for a one-time project when you can easily borrow it from someone local?

Our mission is to build trust, reduce waste, and save money by turning neighborhoods into shared tool sheds.

---

## ✨ Features

- **Modern & Premium UI:** Built with a stunning glassmorphism aesthetic, ultra-smooth animations, and the crisp *Inter* font.
- **Secure Authentication:** Robust user registration and login system powered by JWT (JSON Web Tokens) and bcrypt password hashing.
- **Dynamic Tool Inventory:** Users can seamlessly add their own tools to the "Community Shed", update their condition, and toggle their real-time availability.
- **Rich Media Uploads:** Integrated with Cloudinary to allow users to securely upload and display multiple high-quality photos of their tools.
- **Smart Filtering:** Quickly browse the community feed or search for exactly what you need with category dropdowns and responsive text search.
- **Location Aware:** Tools are tagged with the owner's neighborhood (e.g., Kahawa West) to make localized sharing effortless.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 18 (via Vite)
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS v4
- **State Management:** React Hooks (`useState`, `useEffect`)

### Backend
- **Server:** Node.js & Express.js
- **Database:** MongoDB & Mongoose
- **Security:** bcryptjs, jsonwebtoken, CORS
- **Media Storage:** Cloudinary, Multer, multer-storage-cloudinary

### Hosting & Deployment
- **Frontend Cloud:** Vercel (with custom SPA routing configured)
- **Backend Cloud:** Render Web Services
- **Database Cloud:** MongoDB Atlas

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas cluster
- Cloudinary account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/akiba-link.git
   cd akiba-link
   ```

2. **Install Backend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

### Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running Locally
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
npm run devStart
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to view the application!

---
*Built with ❤️ for the community.*
