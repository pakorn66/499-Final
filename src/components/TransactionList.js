import React from "react";

const TransactionList = ({ transactions }) => {
   return (
      <ul>
         {transactions.map((txn, index) => (
            <li key={index}>
               {txn.type.toUpperCase()} - ${txn.amount} on{" "}
               {new Date(txn.date).toLocaleDateString()}
            </li>
         ))}
      </ul>
   );
};

export default TransactionList;
