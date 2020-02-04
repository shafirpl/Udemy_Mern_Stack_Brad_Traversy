const mongoose = require('mongoose');

const config = require('config');

const db = config.get('mongoURI');

const connectDB = async () => {
    try{
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected...')

    } catch(err){
        console.error(err.message);
        //this means if our application fails to connect, terminate the application
        process.exit(1);
    }
}

module.exports = connectDB;