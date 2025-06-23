const Milestone = require('../models/Milestone');

exports.getMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findOne({ _id: req.params.id, userId: req.user.id });
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createMilestone = async (req, res) => {
  try {
    const { title, date, notes } = req.body;
    const milestone = new Milestone({ userId: req.user.id, title, date, notes });
    await milestone.save();
    res.status(201).json(milestone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMilestone = async (req, res) => {
  try {
    const { title, date, notes } = req.body;
    const milestone = await Milestone.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, date, notes },
      { new: true }
    );
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    res.json({ message: 'Milestone deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 