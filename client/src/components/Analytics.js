import { Progress } from 'antd';
import React from 'react';

const Analytics = ({ allTransaction }) => {
    const categories = ['salary', 'tip', 'project', 'food', 'movie', 'bills', 'medical', 'fee', 'tax'];

    const totalTransaction = allTransaction.length;
    const incomeTransactions = allTransaction.filter(t => t.type === 'income');
    const expenseTransactions = allTransaction.filter(t => t.type === 'expense');

    const totalIncomeCount = incomeTransactions.length;
    const totalExpenseCount = expenseTransactions.length;

    const totalIncomePercent = totalTransaction ? (totalIncomeCount / totalTransaction) * 100 : 0;
    const totalExpensePercent = totalTransaction ? (totalExpenseCount / totalTransaction) * 100 : 0;

    const totalTurnover = allTransaction.reduce((acc, t) => acc + t.amount, 0);
    const totalIncomeTurnover = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalExpenseTurnover = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

    const totalIncomeTurnoverPercent = totalTurnover ? (totalIncomeTurnover / totalTurnover) * 100 : 0;
    const totalExpenseTurnoverPercent = totalTurnover ? (totalExpenseTurnover / totalTurnover) * 100 : 0;

    const getCategoryTotal = (type, category) =>
        allTransaction
            .filter(t => t.type === type && t.category === category)
            .reduce((acc, t) => acc + t.amount, 0);

    return (
        <>
            <div className='row justify-content-center'>
                <div className='col-md-4'>
                    <div className='card'>
                        <div className='card-header'>Total Transactions: {totalTransaction}</div>
                        <div className='card-body'>
                            <h5 className='text-success'>Income: {totalIncomeCount}</h5>
                            <h5 className='text-danger'>Expense: {totalExpenseCount}</h5>
                            <div>
                                <Progress
                                    type='circle'
                                    strokeColor='green'
                                    className='mx-2'
                                    percent={totalIncomePercent.toFixed(0)}
                                />
                                <Progress
                                    type='circle'
                                    strokeColor='red'
                                    className='mx-2'
                                    percent={totalExpensePercent.toFixed(0)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-md-4'>
                    <div className='card'>
                        <div className='card-header'>Total Turnover: ₹{totalTurnover}</div>
                        <div className='card-body'>
                            <h5 className='text-success'>Income: ₹{totalIncomeTurnover}</h5>
                            <h5 className='text-danger'>Expense: ₹{totalExpenseTurnover}</h5>
                            <div>
                                <Progress
                                    type='circle'
                                    strokeColor='green'
                                    className='mx-2'
                                    percent={totalIncomeTurnoverPercent.toFixed(0)}
                                />
                                <Progress
                                    type='circle'
                                    strokeColor='red'
                                    className='mx-2'
                                    percent={totalExpenseTurnoverPercent.toFixed(0)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='row mt-4'>
                <div className='col-md-6'>
                    <h4 className='text-success'>Category-wise Income</h4>
                    {categories.map(category => {
                        const amount = getCategoryTotal('income', category);
                        return amount > 0 && (
                            <div className='card mb-2' key={`income-${category}`}>
                                <div className='card-body'>
                                    <h6>{category}</h6>
                                    <Progress percent={((amount / totalIncomeTurnover) * 100).toFixed(0)} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className='col-md-6'>
                    <h4 className='text-danger'>Category-wise Expense</h4>
                    {categories.map(category => {
                        const amount = getCategoryTotal('expense', category);
                        return amount > 0 && (
                            <div className='card mb-2' key={`expense-${category}`}>
                                <div className='card-body'>
                                    <h6>{category}</h6>
                                    <Progress percent={((amount / totalExpenseTurnover) * 100).toFixed(0)} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Analytics;
