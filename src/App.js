import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);  // สถานะการโหลด

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // เปลี่ยน URL ที่นี่เป็น URL ของ Backend ที่ deploy บน Vercel
      const res = await axios.get("https://money-app-backend-pearl.vercel.app/api/transaction");
      setTransactions(res.data);
      calculateBalance(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      alert("Error fetching transactions. Please try again later.");
    } finally {
      setLoading(false);  // หยุดสถานะการโหลดเมื่อข้อมูลได้รับหรือเกิดข้อผิดพลาด
    }
  };

  const calculateBalance = (data) => {
    const total = data.reduce((acc, item) => {
      return item.type === "deposit" ? acc + item.amount : acc - item.amount;
    }, 0);
    setBalance(total);
  };

  const handleTransaction = async (form) => {
    // ตรวจสอบข้อมูลใน form ก่อนส่ง
    if (!form.amount || isNaN(form.amount) || form.amount <= 0) {
      alert("Amount must be a positive number.");
      return;
    }
  
    if (!form.type || (form.type !== "deposit" && form.type !== "withdraw")) {
      alert('Type must be either "deposit" or "withdraw".');
      return;
    }
  
    // เพิ่มสถานะการโหลดก่อนเริ่มการส่งข้อมูล
    setLoading(true);
  
    try {
      // ส่งข้อมูลไปยัง API
      const res = await axios.post("https://money-app-backend-pearl.vercel.app/api/transaction", form);
  
      // ตรวจสอบว่า API ส่งกลับข้อมูลสำเร็จหรือไม่
      if (res.status === 201) {
        setTransactions((prevTransactions) => {
          const updatedTransactions = [...prevTransactions, res.data];
          calculateBalance(updatedTransactions);
          return updatedTransactions;
        });
        alert("Transaction added successfully!");  // แจ้งเตือนเมื่อสำเร็จ
      } else {
        alert("Failed to add transaction. Please try again.");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Error adding transaction. Please try again later.");
    } finally {
      // หยุดสถานะการโหลดหลังจากเสร็จสิ้น
      setLoading(false);
    }
  };



  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  if (loading) {
    return <div>Loading...</div>;  // เมื่อข้อมูลกำลังโหลด
  }

  return (
    <div className="container">
      <h1>Money Manager</h1>
      <div className="balance-section">
        <div className="balance-label">Current Balance</div>
        <div className="balance-amount">{formatCurrency(balance)}</div>
      </div>
      <TransactionForm onSubmit={handleTransaction} />
      <TransactionList transactions={transactions} />

    </div>
  );
}

export default App;

