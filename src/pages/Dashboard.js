import React, {useEffect, useState} from 'react'
import Header from '../Components/Header'
import Cards from '../Components/Cards'
import NoTransactions from "../Components/NoTransactions.js";
import ChartComponent from '../Components/Charts/index.js';
import moment from "moment";
import AddExpenseModal from '../Components/Modals/addExpense';
import AddIncomeModal from '../Components/Modals/addIncome';
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { addDoc, collection,query,getDocs} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionTable from '../Components/TranactionTable';


const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

 

   
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };
  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    
    addTransaction(newTransaction);
    
  };
  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      
        if(!many) toast.success("Transaction Added!");
        let newArr= transactions;
        newArr.push(transaction);
        setTransactions(newArr);
        calculateBalance();
      
    } catch (e) {
      console.error("Error adding document: ", e);
      
      if(!many) toast.error("Couldn't add transaction");
      
    }
  }
  useEffect(()=>{
    fetchTransactions();
  },[user]);
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transaction Array",transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
    
  
  
    
  }
  let sortedTransactions= transactions.sort((a, b) => {
   
      return new Date(a.date) - new Date(b.date); 
    })
  return (
    <div>
      <Header/>
      {loading?(<p>Loading...</p>
      ):(
      <>
      <Cards 
        totalBalance={totalBalance}
        income={income}
        expenses={expenses}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
      />
      {transactions && transactions.length!=0? (<ChartComponent sortedTransactions={sortedTransactions}/>):(<NoTransactions/>)}
      <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
          </>
         )}
      </div>
  )
}

export default Dashboard;