const express = require('express');
const dataItems = require('./schema');


const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name are required',
      });
    }

    const newDataItem = await dataItems.create({ name, description, price });
    res.status(201).json({
      success: true,
      message: 'New created successfully',
      data: newDataItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating data',
      error: error.message,
    });
  }
});

router.get('/fetch', async (req, res) => {
  try {
    const dataItem = await dataItems.find();
    res.status(200).json({ success: true, data: dataItems });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching the data',
      error: error.message,
    });
  }
});


const getItem = router.get('/fetch', async (req, res) => {
  try{
    const dataItem = await dataItem.find();
    console.log(dataItems);
    res.status(200).json({ success: true, data: dataItems });
  }
  catch(error){
    res.status(500).json({ success: false, message: 'Error fetching the data', error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (name === '' || price === '') {
      return res.status(400).json({
        success: false,
        message: 'Name and Price cannot be empty',
      });
    }

    const updatedDataItem = await dataItems.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true, runValidators: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ success: false, message: 'Data item not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Data item updated successfully',
      data: updatedDataItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating data item', error: error.message });
  }
});

router.delete('/del/:id', async (req, res) => {
  try {
    const daleteDataItems = await dataItems.findByIdAndDelete(req.params.id);
    if (!daleteDataItems) {
      return res.status(404).json({ success: false, message: 'Data item not found' });
    }
    res.status(200).json({ success: true, message: 'data item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting Data item', error: error.message });
  }
});

module.exports = router