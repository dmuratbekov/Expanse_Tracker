import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import api from "../api/axios";
import "./Dashboard.css";

export function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [byCategory, setByCategory] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get("/analytics/summary"),
            api.get("/analytics/by-category?type=expense"),
            api.get("/transactions?limit=5"),
        ]).then(([sumRes, catRes, txRes]) => {
            setSummary(sumRes.data);
            setByCategory(catRes.data.data.map(item => ({
                ...item,
                total: Number(item.total),
            })));
            setTransactions(txRes.data.transactions);
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ padding: "40px", color: "#6366f1" }}>Загрузка...</div>;

    const totalBalance = Number(summary?.total_balance || 0);
    const totalIncome = Number(summary?.total_income || 0);
    const totalExpenses = Number(summary?.total_expense || 0);

    return (
        <div className="dashboardContainer">
            <div className="dashboardHeader">
                <h1 className="pageTitle">Панель управления</h1>
                <p className="pageSubtitle">Обзор ваших финансов</p>
            </div>

            <div className="statsGrid">
                <div className="statCard">
                    <div className="statCardHeader">
                        <div className="iconBadge iconBadgeBlue"><Wallet className="iconBlue" /></div>
                        <span className="statLabel">Баланс</span>
                    </div>
                    <div className="statValue">{totalBalance.toLocaleString("ru-RU")} KGS</div>
                    <p className="statDescription">Текущий баланс</p>
                </div>
                <div className="statCard">
                    <div className="statCardHeader">
                        <div className="iconBadge iconBadgeGreen"><TrendingUp className="iconIncome" /></div>
                        <span className="statLabel">Доход</span>
                    </div>
                    <div className="statValue textIncome">+{totalIncome.toLocaleString("ru-RU")} KGS</div>
                    <p className="statDescription">За этот месяц</p>
                </div>
                <div className="statCard">
                    <div className="statCardHeader">
                        <div className="iconBadge iconBadgeRed"><TrendingDown className="iconExpense" /></div>
                        <span className="statLabel">Расходы</span>
                    </div>
                    <div className="statValue textExpense">-{totalExpenses.toLocaleString("ru-RU")} KGS</div>
                    <p className="statDescription">За этот месяц</p>
                </div>
            </div>

            <div className="contentGrid">
                <div className="card">
                    <div className="cardHeader">
                        <h3 className="cardTitle">Последние транзакции</h3>
                    </div>
                    <div className="cardContent">
                        <div className="transactionsList">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="transactionItem">
                                    <div className="transactionMain">
                                        <div className={`iconBadgeSm ${tx.type === "income" ? "iconBadgeIncome" : "iconBadgeExpense"}`}>
                                            {tx.type === "income"
                                                ? <ArrowUpRight className="iconIncome" />
                                                : <ArrowDownRight className="iconExpense" />}
                                        </div>
                                        <div className="transactionInfo">
                                            <p className="transactionTitle">{tx.description || tx.category_name || "—"}</p>
                                            <p className="transactionCategory">{tx.category_name || "Без категории"}</p>
                                        </div>
                                    </div>
                                    <div className="transactionDetails">
                                        <p className={`transactionAmount ${tx.type === "income" ? "textIncome" : "textExpense"}`}>
                                            {tx.type === "income" ? "+" : "-"}{Number(tx.amount).toLocaleString("ru-RU")} KGS
                                        </p>
                                        <p className="transactionDate">
                                            {new Date(tx.transaction_date).toLocaleDateString("ru-RU")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {transactions.length === 0 && (
                                <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>Нет транзакций</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="cardHeader">
                        <h3 className="cardTitle">Расходы по категориям</h3>
                    </div>
                    <div className="cardContent">
                        {byCategory.length === 0 ? (
                            <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>Нет данных</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie data={byCategory} cx="50%" cy="50%"
                                        labelLine={false} outerRadius={100}
                                        dataKey="total" nameKey="name">
                                        {byCategory.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v) => `${Number(v).toLocaleString("ru-RU")} KGS`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}