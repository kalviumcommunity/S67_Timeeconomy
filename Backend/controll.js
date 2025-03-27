const express = require('express');
const {body, validationResult} = require('express-validator');
// const dataItems = require('./schema');
// const Entity = require('./schema');
const pool = require('./db');


const router = express.Router();

router.get('/fetch/user/:userid', async (req, res) => {
  try {
      const { userid } = req.params;
      const [userEntities] = await pool.execute(
          "SELECT * FROM data_items WHERE created_by = ?",
          [userid]
      );
      res.status(200).json({ success: true, data: userEntities });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching user entities', error: error.message });
  }
});


router.post('/create',[
  body('name').notEmpty().withMessage('Please enter the name for the data item'),
  body('time').isFloat({gt: 0}).withMessage('Please enter the time for the data item'),
  body('description').optional().isString().withMessage('Please enter a valid description for the data item'),
  body('created_by').notEmpty().withMessage('User ID is required')
  

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
    }
  try {
    const { name, description, time } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO data_items (name, description, time, created_by) VALUES (?, ?, ?, ?)",
      [name, description, time, created_by]
    );
    res.status(201).json({ success: true, message: "Created successfully", id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating data", error: error.message });
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
    res.status(200).json({ success: true, data: dataItem });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching the data',
      error: error.message,
    });
  }
});


 router.get('/fetch/user/:userid', async (req, res) => {
  try{
    const {userid} = req.params;
    const userEntities = await Entity.find({created_by: userid});
    res.status(200).json({ success: true, data: userEntities });
  }catch(error){
    res.status(500).json({ success: false, message: 'Error fetching user entities', error: error.message });

  }
})

router.put('/update/:id', async (req, res) => {
  try {
    const { name, description, time } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (time) updateFields.time = time;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided for update' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid data item ID' });
    }

    const updatedDataItem = await dataItems.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedDataItem) {
      return res.status(404).json({ success: false, message: 'Data item not found' });
    }

    res.status(200).json({ success: true, message: 'Data item updated successfully', data: updatedDataItem });
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
      const deletedDataItem = await dataItems.findByIdAndDelete(req.params.id);
      if (!deletedDataItem) {
        return res.status(404).json({ success: false, message: 'Data item not found' });
      }
      res.status(200).json({ success: true, message: 'Data item deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting data item', error: error.message });
    }
  });
  

module.exports = router