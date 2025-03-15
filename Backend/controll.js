const express = require('express');
const {body, validationResult} = require('express-validator');
const dataItems = require('./schema');


const router = express.Router();

router.post('/create',[
  body('name').notEmpty().withMessage('Please enter the name for the data item'),
  body('time').isFloat({gt: 0}).withMessage('Please enter the time for the data item'),
  body('description').optional().isString().withMessage('Please enter a valid description for the data item')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
    }
  try {
    const { name, description, time } = req.body;
    if (!name || !time) {
      return res.status(400).json({
        success: false,
        message: 'Name are required',
      });
    }

    const newDataItem = await dataItems.create({ name, description, time });
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

router.post("/entities",[
  body('name').notEmpty().withMessage('Please enter the name for the data item'),
  body('description').optional().isString().withMessage('Please enter a valid description for the data item')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { name, description } = req.body;
    const newEntity = new Entity({ name, description });
    await newEntity.save();
    res.status(201).json(newEntity);
  } catch (error) {
    res.status(500).json({ error: "Error adding entity" });
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
    const { name, description, time } = req.body;
    if (name === '' || time === '') {
      return res.status(400).json({
        success: false,
        message: 'Name and time cannot be empty',
      });
    }

    const updatedDataItem = await dataItems.findByIdAndUpdate(
      req.params.id,
      { name, description, time },
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

router.put('/main/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const updatedEntity = await Entity.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedEntity) {
      return res.status(404).json({ success: false, message: 'Entity not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Entity updated successfully',
      data: updatedEntity,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating entity', error: error.message });
  }
  });

  router.delete('/main/:id', async (req, res) => {
    try{
      await Entity.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: 'Entity deleted successfully' });  
    }
    catch(error){
      res.status(500).json({ success: false, message: 'Error deleting entity', error: error.message });
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