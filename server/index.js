const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors()); 

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true })); 

app.use((req, res, next) => {
    console.log(`➡️ Incoming Request: [${req.method}] ${req.url}`);
    next();
});

const authRoutes = require('./routes/auth');
const propertiesRoutes = require('./routes/properties');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});