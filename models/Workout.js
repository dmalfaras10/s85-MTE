const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Workout', workoutSchema);