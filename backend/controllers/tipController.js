const Tip = require('../models/Tip');

exports.getTips = async (req, res) => {
  try {
    const tips = await Tip.find({ milestoneId: req.params.milestoneId }).populate('userId', 'name');
    res.json(tips);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTip = async (req, res) => {
  try {
    const { content } = req.body;
    const tip = new Tip({ milestoneId: req.params.milestoneId, userId: req.user.id, content });
    await tip.save();
    res.status(201).json(tip);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 