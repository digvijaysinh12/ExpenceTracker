import Transaction from "../models/transactionModel.js"
import moment from 'moment'

const getAllTransaction = async (req, res) => {
  try {
    const { frequency, selectedDate, userId,type } = req.body;
    const query = {
      userId,
      ...(type!=='all' && {type})
      ,
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
                $gte: new Date(moment(selectedDate[0]).startOf("day").toDate()),
                $lte: new Date(moment(selectedDate[1]).endOf("day").toDate()),
            },
          }),
    };


    const transaction = await Transaction.find(query);
    res.status(200).json(transaction);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const addTransaction = async(req,res) => {
    try{
        const newTransaction = new Transaction(req.body);
        
        await newTransaction.save();
        res.status(201).send('Trasaction Created')
    }catch(error){
        console.log(error.message);
        res.status(500).json({message:error.message});
    }

}
// Update Transaction
const editTransaction = async (req, res) => {
  try {
    const { transactionId, payload } = req.body;
        console.log("Req body is ==> ",req.body);
    const isUpdate = await Transaction.findByIdAndUpdate(transactionId, payload);
    if(isUpdate){
          res.status(200).send("Transaction Updated Successfully");
    }else{
          res.status(404).send("Transaction Not updated Successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Delete Transaction
const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body;
    await Transaction.findByIdAndDelete(transactionId);
    res.status(200).send("Transaction Deleted Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export default {
  getAllTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction
};
