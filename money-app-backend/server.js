const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // โหลด environment variables จาก .env

const app = express();
const PORT = process.env.PORT || 5000; // ใช้ PORT จาก .env หรือ default = 5000

// Middleware
app.use(express.json());
app.use(cors());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// สร้าง Schema และ Model สำหรับ Transaction
const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'income'], required: true },
  date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes

// GET: ดึงข้อมูล transactions ทั้งหมด
app.get('/api/transaction', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching transactions: ' + err });
  }
});

// POST: เพิ่ม transaction ใหม่
app.post('/api/transaction', async (req, res) => {
  const { amount, type } = req.body;

  // ตรวจสอบข้อมูลที่ได้รับจาก client
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number." });
  }

  if (!type || (type !== "deposit" && type !== "withdraw" && type !== "income")) {
    return res.status(400).json({ error: 'Type must be "deposit", "withdraw", or "income".' });
  }

  try {
    const newTransaction = new Transaction({ amount, type });
    await newTransaction.save();

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error("Error adding transaction:", err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});



// เปิดเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = (req, res) => {
  app(req, res); 
};