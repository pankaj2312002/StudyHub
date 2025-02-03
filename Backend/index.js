
const express = require('express');
const app = express();
console.log("sucessfully reach to backend...")
const connectDB = require('./config/db');
const { cloudinaryConnect } = require("./config/cloudinary");
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoute');
const searchRoutes = require('./routes/searchRoutes')
const likeRoutes = require('./routes/likeRoutes')


require('dotenv').config();
const cookieParser = require('cookie-parser');

const cors = require('cors');

app.use(cors({
  origin: ['https://notes-sharing-system12.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());



connectDB();
cloudinaryConnect();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', noteRoutes);
app.use('/api/v1/user', searchRoutes);
app.use('/api/v1/auth/notes', likeRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));