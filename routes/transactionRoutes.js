// require important dependencies
const express = require('express');
const { addTransaction, getAllTransaction ,editTransaction,deleteTransaction} = require('../controllers/transactionController');

//router object
const router = express.Router()
/*-----routers----*/
//add transaction method POST
router.post('/add-transaction',addTransaction);
//Edit transaction
router.post('/edit-transaction',editTransaction);
//delete transaction
router.post('/delete-transaction', deleteTransaction);
//get transaction
router.post('/get-transaction',getAllTransaction);
//export
module.exports = router;








































