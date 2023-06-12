const Machinery = require('../models/machinery');

exports.createMachinery = async (req, res) => {
  try {
    const newMachinery = new Machinery(req.body);
    await newMachinery.save();
    res.status(201).json(newMachinery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMachinery = async (req, res) => {
  try {
    const machinery = await Machinery.find();
    res.status(200).json(machinery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.ownerMachinery = async (req, res) => {
    try {
      const machinery = await Machinery.find({owner_id:req.params.id});
      res.status(200).json(machinery);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.updateMachinery = async (req, res) => {
  try {
    const updatedMachinery = await Machinery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedMachinery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMachinery = async (req, res) => {
  try {
    await Machinery.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Machinery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};