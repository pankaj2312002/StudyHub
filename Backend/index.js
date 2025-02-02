
const express = require('express');
const app = express();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoute');
const searchRoutes = require('./routes/searchRoutes')
const likeRoutes = require('./routes/likeRoutes')

const authme = require('./middleware/authme')

require('dotenv').config();
const cookieParser = require('cookie-parser');

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));


app.options('*', cors());  


app.use(express.json());
app.use(cookieParser());



connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', noteRoutes);
app.use('/api/v1/user', searchRoutes);
app.use('/api/v1/auth/notes', likeRoutes);

app.get('api/v1/auth/me', authme, (req, res) => {
 
  res.status(200).json({
      success: true,
      User: req.user 
  });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
