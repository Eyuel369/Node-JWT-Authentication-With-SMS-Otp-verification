// config/gridfs.js
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

const connectGridFS = () => {
  const conn = mongoose.connection;
  conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
  });
};

module.exports = { connectGridFS, getGfs: () => gfs };
