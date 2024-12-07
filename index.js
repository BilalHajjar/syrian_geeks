const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes'); 

dotenv.config();

mongoose
  .connect("mongodb+srv://bhajjar517:6M7mWNbCsVxpqRIX@cluster0.lytn7.mongodb.net/")
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(cors()); 
app.use(bodyParser.json()); 
// app.use(helmet()); 
// app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Job Board API is running!' });
});

app.use('/users', userRoutes); 
app.use('/jobs', jobRoutes); 
app.use('/applications', applicationRoutes); 
app.use('/profile', profileRoutes); 
app.use('/admin', adminRoutes); 
app.use('/auth', authRoutes);  


app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
