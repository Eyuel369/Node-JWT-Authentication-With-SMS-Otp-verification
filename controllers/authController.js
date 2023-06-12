const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getGfs } = require('../config/gridfs');
const upload = require('../middleware/upload');
require('dotenv').config();



const axios = require('axios');


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString().substring(0, 6);
};

//Helper function to send OTP
const sendOTP = async (phone, otp,name) => {

let phonenumber = String(phone);

let otpval = String(otp);

let fname = String(name);

const baseUrl = 'https://api.afromessage.com/api/send';
// api token
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoidVJxd2ZsankwTWhHUmtsSDlqUGVHeGtDcmdxWnFhUHIiLCJleHAiOjE4NDMyMTk5MzQsImlhdCI6MTY4NTM2NzEzNCwianRpIjoiNjY2NTM3YTAtNzg3MC00OTk1LWJjOGUtZmM0NjVkZTAyMWUxIn0.96CumF439FHT-OMpp4SN2b4fDD5MxOg8ZMzwkocfmIE';
// header
const headers = { 'Authorization': 'Bearer ' + token };
// request parameters
const to = phonenumber;
const message = `${fname} : Your OTP is ${otpval} use this OTP to verify your account.`;
const from = 'e80ad9d8-adf3-463f-80f4-7c4b39f7f164';
// final url
const url = `${baseUrl}?from=${from}&to=${to}&message=${message}`;

// make request
axios.get(url, { headers })
  .then(response => {
    // check result
    if (response.status === 200) {
      // request is success. inspect the json object for the value of `acknowledge`
      const json = response.data;
      if (json.acknowledge === 'success') {
        // do success
        console.log('api success');
      } else {
        // do failure
        console.log('api error');
      }
    } else {
      // anything other than 200 goes here.
      console.log(`http error ... code: ${response.status}, msg: ${response.data}`);
    }
  })
  .catch(error => {
    console.log(error);
  });
}

// Registration
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, password, phone, role } = req.body;
    const otp = generateOTP();
    const user = new User({ first_name, last_name, password, phone, otp, role });

    if (req.file) {
      const gfs = getGfs();
      const writeStream = gfs.createWriteStream({
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });

      writeStream.on('close', async (file) => {
        user.image = file._id;
        await user.save();
        await sendOTP(phone, otp, first_name);
        res.status(201).json({ message: 'User registered. OTP sent for verification.' });
      });

      writeStream.write(req.file.buffer);
      writeStream.end();
    } else {
      await user.save();
      await sendOTP(phone, otp, first_name);
      res.status(201).json({ message: 'User registered. OTP sent for verification.' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get image by id
exports.getImage = async (req, res) => {
  try {
    const gfs = getGfs();
    const fileId = req.params.id;

    gfs.files.findOne({ _id: fileId }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({ error: 'No file found' });
      }

      if (file.contentType.startsWith('image')) {
        const readStream = gfs.createReadStream({ _id: fileId });
        readStream.pipe(res);
      } else {
        res.status(404).json({ error: 'Not an image' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get user by id
exports.getUserById = async (req, res) =>  {
  try {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userObj = user.toObject();

  if (user.image) {
    const gfs = getGfs();
    const readStream = gfs.createReadStream(user.image);

    let buffer = Buffer.alloc(0);
    readStream.on('data', (data) => {
      buffer = Buffer.concat([buffer, data]);
    });

    readStream.on('end', () => {
      userObj.image = buffer.toString('base64');
      res.status(200).json(userObj);
    });
  } else {
    res.status(200).json(userObj);
  }

} catch (error) {
  res.status(400).json({ error: error.message });
}
};


// OTP verification
exports.verifyOTP = async (req, res) => {
 try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.otp === otp) {
      user.verified = true;
      user.otp = undefined;
      await user.save();
      res.status(200).json({ message: 'OTP verified. User is now verified.' });
    } else {
      res.status(400).json({ error: 'Invalid OTP.' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!user.verified) {
      return res.status(401).json({ error: 'User not verified. Please verify your OTP first.' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password.' });
    }
    const maxAge = 10*60*60;
    const token = jwt.sign({user}, process.env.JWT_TOKEN_SECRET,{ expiresIn: maxAge });
    res.cookie("jwt", token);
    res.status(200).json({message: 'Login Successful.', Token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
};

// Reset password
exports.resetPassword = async(req, res) => {
    try {
      const { phone, otp, newPassword } = req.body;
      const user = await User.findOne({ phone });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      if (user.otp !== otp) {
        return res.status(401).json({ error: 'Invalid OTP.' });
      }
  
      user.password = newPassword;
      user.otp = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
