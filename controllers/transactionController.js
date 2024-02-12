// requiring important dependencies
const transactionModel = require("../models/transactionModel");
const moment=require('moment')
// getAll transaction arrow function
const getAllTransaction =async(req, res)=>{
    try{
        const {frequency ,selectedDate,type} = req.body
        const transactions =await transactionModel.find({
            ...(frequency !==' custom' ? {
                date:{
                    $gt :moment().subtract(Number(frequency),'d').toDate(),
                },
            }:{
                date:{
                    $gte : selectedDate[0],
                    $lte: selectedDate[1]
                },  
            }),
            userid:req.body.userid ,
            ...(type !== 'all' && {type}),
        });
        res.status(200).json(transactions);
    }catch(error){
        console.log(error);
        res.status(500).json(error);

    }
};
// edit transaction arrow function
const editTransaction =async(req,res)=>{
    try{
        await transactionModel.findOneAndUpdate({_id:req.body.transactionId},req.body.payload);
        res.status(200).send('Edit SuccessFully');
    }catch(error){
        console.log(error);
        res.status(500).json(error)
    }
};
// delete transaction arrow function
const deleteTransaction =async(req,res)=>{
    try{
        await transactionModel.findOneAndDelete({_id:req.body.transactionId})
        res.status(200).send('Deleted SuccessFully');
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
};
// add transaction arrow function
const addTransaction =async(req, res)=>{
    try{
        const newTrasaction = new transactionModel(req.body)
        await newTrasaction.save()
        res.status(201).send('Transaction Created')
    }catch(error){
        console.log(error);
        res.status(500).json(error);

    }
};
// export
 module.exports = {getAllTransaction,addTransaction,editTransaction,deleteTransaction};



































