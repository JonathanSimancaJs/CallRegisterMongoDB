// Modelo para la colección de llamadas.

const mongoose = require('mongoose');

const callSchema =  new mongoose.Schema({
    date:{ type: Date, default: Date.now },
    customer: String,
    topic: String,
    idcard: String,
    local: String,
    school: String,
    place: String,
    area: String,
    phone: String,
    schedule: String,
    address: String,
    note: String,
    caseid: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
});

module.exports = mongoose.model('calls', callSchema);
