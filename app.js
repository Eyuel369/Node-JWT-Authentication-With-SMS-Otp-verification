const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const machineryRoutes = require('./routes/machineryRoutes');
const contractsRoutes = require('./routes/contractRoutes');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://Eyuel:asfaw1994@cluster0.237sgbj.mongodb.net/armada', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/farm', farmRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/contracts', contractsRoutes);

// app.use(cookieParser());
console.log(Date.now());


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));