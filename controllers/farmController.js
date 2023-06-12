const Farm = require('../models/farm');
const { where } = require('../models/user');

exports.createFarm = async (req, res) => {

  try {
    const newFarm = new Farm({
      farm_name: req.body.farm_name,
      owner_id: req.body.owner_id,
      farm_size: req.body.farm_size,
      farm_image: req.body.farm_image,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      crops_grown: req.body.crops_grown,
      soil_type: req.body.soil_type
    });
    const savedFarm = await newFarm.save();
    res.status(201).json(savedFarm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getFarmById = async (req, res) => {
  try {
    const farm = await Farm.find({owner_id:req.params.id});
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }
    res.json(farm);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }
    farm.farm_name = req.body.farm_name;
    farm.owner_id = req.body.owner_id;
    farm.farm_size =req.body.farm_size;
    farm.farm_image = req.body.farm_image;
    farm.latitude = req.body.latitude;
    farm.longitude = req.body.longitude;
    farm.crops_grown = req.body.crops_grown;
    farm.soil_type = req.body.soil_type;
    const updatedFarm = await farm.updateOne();
    res.json(updatedFarm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }
    
    await farm.deleteOne();
    res.json({ message: 'Farm deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
