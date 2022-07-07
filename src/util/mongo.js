const mongoose = require('mongoose')

module.exports = async (mongoPath) =>{

    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    return mongoose
}

