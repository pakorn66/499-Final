// models/Transaction.js
const transactionSchema = new mongoose.Schema({
   description: { type: String, required: true },
   amount: { type: Number, required: true },
   type: { type: String, enum: ['deposit', 'withdraw', 'income'], required: true }, // เพิ่ม 'income' เป็นประเภทการทำรายการ
   category: { type: String, required: true }, // เพิ่ม category เพื่อจัดการกับประเภท
   date: { type: Date, default: Date.now },
 });
 
 const Transaction = mongoose.model('Transaction', transactionSchema);
 
module.exports = Transaction;
