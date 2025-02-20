const {connect} = require('mongoose');

const connectDB = async (url) => {
    try {
        await connect(url)
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database');
        console.error(error);
    }
}
module.exports = connectDB;