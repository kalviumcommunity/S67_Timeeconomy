import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Addentity =() => {
    const [entities, setEntities] = useState([]);
    const [data, setData] = useState({
        name: '',
        description: '',
        time:''
    });
    const [edit, setEdit] = useState(null);

    useEffect(() => {
        fetchEntities();
    }
    , []);

    const fetchEntities = async () => {
        try {
            const response = await axios.get('http://localhost:3000/main');
            setEntities(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
          if (edit) {
              
              await axios.put(`http://localhost:3000/main/${editId}`, data);
              setEntities((prev) =>
                  prev.map((entity) => (entity._id === edit ? { ...entity, ...data } : entity))
              );
          } else {
             
              const response = await axios.post('http://localhost:3000/main', data);
              setEntities((prevEntities) => [...prevEntities, response.data]);
          }

          setData({ name: '', description: '', time: '' });
          setEdit(null); 
      } catch (error) {
          console.error(error);
      }

  };

  const handleDelete = async (id) => {
    try{
      await axios.delete(`http://localhost:3000/main/${id}`);
      setEntities((prev) => prev.filter((entity) => entity._id !== id));
    }catch(error){
      console.error(error);
    }
  }
  const handleEdit = (entity) => {
    setData(entity);
    setEdit(entity._id);
  }


         return (
    <div>
      <h2>{edit ?'Update entity': 'Add new entity'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Entity Name"
          value={data.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={data.description}
          onChange={handleChange}
          required
        />
        <button type="submit">{edit ? 'Update' : 'Add'}</button>
      </form>

      <h3>Entities List</h3>
      <ul>
        {entities.map((entity) => (
          <li key={entity.id}>
            <strong>{entity.name}:</strong> {entity.description} <br />
            <button onClick={() => handleEdit(entity)}>Edit</button>
            <button onClick={() => handleDelete(entity._id)}>Delete</button>
            <small>Added on: {new Date(entity.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Addentity;