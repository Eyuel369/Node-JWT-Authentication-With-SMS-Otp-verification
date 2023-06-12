const mongoose = require('mongoose');

const machinerySchema = new mongoose.Schema({
  owner_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String,enum: ['Tractor', 'Combine Harvester', 'Thresher','Tractor Attachment','Other'], required: true },
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  status: { type: String, enum: ['Free', 'In Mentainance', 'Rented'],default: "Free"  },
  year: { type: Number },
  horsepower: { type: Number },
  hour_meter: { type: String },
  region: { type: String },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' },
  grain_tank_capacity: { type: Number },
  grain_types: { type: String },
  required_power: { type: Number },
  working_capacity: { type: Number },
  attachment_type:{ type: String ,enum: ['Disc Plough', 'Disc Harrow', 'Planter','Sprayer','Baler','Trailer', 'Other']},
  specification:{ type: String},
  discs: { type: Number },
  rows: { type: Number },
  tank_capacity: { type: Number },
  loading_capacity: { type: Number },
  platform_length: { type: Number },
  platform_width: { type: Number },
  sideboard_height: { type: Number },
  num_tires: { type: Number },
  additional_info: { type: String, maxlength: 100 },
},{
  timestamps: true // Add this option to include timestamps
});

const Machinery = mongoose.model('Machinery', machinerySchema);

module.exports = Machinery;