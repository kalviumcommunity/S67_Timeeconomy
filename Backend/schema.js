const mongoose = require('mongoose');
const dataRequired = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Data is reqired']
    },
    description: {
      type: String
    },
    time: {
      type: Date,
      required: [true, 'price is required']
    }
  });
  
  const dataItem = mongoose.model('data', dataRequired);
  module.exports = dataItem;