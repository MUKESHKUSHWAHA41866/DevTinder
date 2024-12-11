const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://kushwahamukesh41866:Mukesh7518@cluster0.vmcsi.mongodb.net/devTinder");
}

module.exports = connectDB;


