import { useState, useEffect } from "react";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import api from "../api/axios";
import "./Analytics.css";
import "./Dashboard.css";

const MONTH_NAMES = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
    "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

export function Analytics() {
    const [summary, setSummary] = useState(null);
    const [byCategory, setByCategory] = useState([]);
    const [byMonth, setByMonth] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const year = new Date().getFullYear();
        Promise.all([
            api.get("/analytics/summary"),
            api.get("/analytics/by-category?type=expense"),
            api.get(`/analytics/by-month?year=${year}`),
        ]).then(([sumRes, catRes, monthRes]) => {
            setSummary(sumRes.data);
            setByCategory(catRes.data.data.map(item => ({
                ...item,
                total: Number(item.total),
            })));
            const monthData = monthRes.data.data.map((d, i) => ({
                month: MONTH_NAMES[i],
                income: Number(d.income),
                expense: Number(d.expense),
                savings: Number(d.income) - Number(d.expense),
            }));
            setByMonth(monthData);
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ padding: "40px", color: "#6366f1" }}>Загрузка...</div>;

    const totalIncome = Number(summary?.total_income || 0);
    const totalExpense = Number(summary?.total_expense || 0);
    const totalSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;
    const monthsWithExpense = byMonth.filter(m => m.expense > 0);
    const avgExpense = monthsWithExpense.length > 0
        ? monthsWithExpense.reduce((s, m) => s + m.expense, 0) / monthsWithExpense.length
        : 0;

    return (
        <div className="analyticsContainer">
            <div className="dashboardHeader">
                <h1 className="pageTitle">Аналитика</h1>
                <p className="pageSubtitle">Детальный анализ ваших финансов</p>
            </div>

            <div className="statsGrid">
                <div className="statCard">
                    <div className="statCardHeader">
                        <div className="iconBadge iconBadgePurple"><TrendingUp className="iconPurple" /></div>
                        <span className="statLabel">Накопления</span>
                    </div>
                    <div className="statValue">{totalSavings.toLocaleString("ru-RU")} KGS</div>
                    <p className="statDescription">За этот месяц</p>
                </div>
                <div className="statCard">
                    <div className="statCardHeader">
                        <div className="iconBadge iconBadgeGreen"><Calendar className="iconGreen" /></div>
                        <span className="statLabel">Процент накоплений</span>
                    </div>
                    <div className="statValue">{savingsRate}%</div>
                    <p className="statDescription">От общего дохода</p>
                </div>
                <div className="statCard">
                    <div className="statCardHeader">
                        <div className="iconBadge iconBadgeOrange"><TrendingDown className="iconOrange" /></div>
                        <span className="statLabel">Средние расходы</span>
                    </div>
                    <div className="statValue">{Math.round(avgExpense).toLocaleString("ru-RU")} KGS</div>
                    <p className="statDescription">В месяц</p>
                </div>
            </div>

            <div className="chartsGrid">
                <div className="chartCard">
                    <div className="chartHeader">
                        <h3 className="chartTitle">Доходы vs Расходы</h3>
                        <p className="chartSubtitle">Помесячная статистика</p>
                    </div>
                    <div className="chartContent">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={byMonth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip formatter={(v) => `${Number(v).toLocaleString("ru-RU")} KGS`}
                                    contentStyle={{ backgroundColor: "white", border: "1px solid #e5e5e5", borderRadius: "8px" }} />
                                <Legend />
                                <Bar dataKey="income" fill="oklch(0.62 0.18 145)" name="Доходы" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="expense" fill="oklch(0.58 0.22 25)" name="Расходы" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chartCard">
                    <div className="chartHeader">
                        <h3 className="chartTitle">Распределение расходов</h3>
                        <p className="chartSubtitle">По категориям</p>
                    </div>
                    <div className="chartContent">
                        {byCategory.length === 0 ? (
                            <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>Нет данных</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={byCategory} cx="50%" cy="50%"
                                        labelLine={false} outerRadius={100}
                                        dataKey="total" nameKey="name"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {byCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Pie>
                                    <Tooltip formatter={(v) => `${Number(v).toLocaleString("ru-RU")} KGS`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            <div className="chartCard">
                <div className="chartHeader">
                    <h3 className="chartTitle">Динамика накоплений</h3>
                    <p className="chartSubtitle">Рост ваших сбережений</p>
                </div>
                <div className="chartContent">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={byMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip formatter={(v) => `${Number(v).toLocaleString("ru-RU")} KGS`}
                                contentStyle={{ backgroundColor: "white", border: "1px solid #e5e5e5", borderRadius: "8px" }} />
                            <Legend />
                            <Line type="monotone" dataKey="savings" stroke="#8b5cf6"
                                strokeWidth={3} name="Накопления" dot={{ fill: "#8b5cf6", r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}