const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UsersSchema = require('./user')

const quizSchema = new Schema({
    
        question_1:{
            type:String,
            required:true
        },
        question_1_answer:{
            type:String,
            required:true
        },
        question_2:{
            type:String,
            required:true
        },
        question_2_answer:{
            type:String,
            required:true
        },
        question_3:{
            type:String,
            required:true
        },
        question_3_answer:{
            type:String,
            required:true
        },
        question_4:{
            type:String,
            required:true
        },
        question_4_answer:{
            type:String,
            required:true
        },
        question_5:{
            type:String,
            required:true
        },
        question_5_answer:{
            type:String,
            required:true
        },
        question_6:{
            type:String,
            required:true
        },
        question_6_answer:{
            type:String,
            required:true
        },
        question_7:{
            type:String,
            required:true
        },
        question_7_answer:{
            type:String,
            required:true
        },
        question_8:{
            type:String,
            required:true
        },
        question_8_answer:{
            type:String,
            required:true
        },
        question_9:{
            type:String,
            required:true
        },
        question_9_answer:{
            type:String,
            required:true
        },
        question_10:{
            type:String,
            required:true
        },
        question_10_answer:{
            type:String,
            required:true
        },
        user: [UsersSchema],

}, { 
    timestamps:true
})

const QuizQuestions = mongoose.model('QuizQuestions', quizSchema);
module.exports = QuizQuestions;