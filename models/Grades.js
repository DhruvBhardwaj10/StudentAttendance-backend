const mongoose=require('mongoose');

const gradesSchema =new mongoose.Schema({

    grades:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Grades',gradesSchema);
