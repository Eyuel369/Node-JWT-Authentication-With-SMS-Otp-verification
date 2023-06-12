const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'uploads.files'
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    required: true
  },
  otp: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['Farmer', 'Service Provider', 'Both'],
    required: true
  },
  // refreshTokens: [String]
},{
  timestamps: true // Add this option to include timestamps
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);