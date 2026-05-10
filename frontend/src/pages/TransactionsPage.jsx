import { useState, useEffect } from "react";
import { Plus, Search, ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from "lucide-react";
import { TransactionModal } from "../components/TransactionModal";
import api from "../api/axios";
import "./Transactions.css";
import "./Dashboard.css";

export function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [txRes, accRes, catRes] = await Promise.all([
                api.get("/transactions?limit=100"),
                api.get("/accounts"),
                api.get("/categories"),
            ]);
            setTransactions(txRes.data.transactions);
            setAccounts(accRes.data.accounts);
            setCategories(catRes.data.categories);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = transactions.filter((tx) => {
        const matchSearch =
            (tx.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tx.category_name || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === "all" || tx.type === filterType;
        return matchSearch && matchType;
    });

    const handleSave = async (data) => {
        try {
            if (editingTransaction) {
                await api.put(`/transactions/${editingTransaction.id}`, data);
            } else {
                await api.post("/transactions", data);
            }
            await fetchAll();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить транзакцию?")) return;
        await api.delete(`/transactions/${id}`);
        setTransactions(transactions.filter(t => t.id !== id));
    };

    if (loading) return <div style={{ padding: "40px", color: "#6366f1" }}>Загрузка...</div>;

    return (
        <div className="transactionsContainer">
            <div className="pageHeader">
                <div className="headerWrapper">
                    <div>
                        <h1 className="pageTitle">Транзакции</h1>
                        <p className="pageSubtitle">Все ваши доходы и расходы</p>
                    </div>
                    <button
                        onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
                        className="addButton"
                    >
                        <Plus className="addIcon" /><span>Добавить</span>
                    </button>
                </div>

                <div className="filtersCard">
                    <div className="filtersWrapper">
                        <div className="searchWrapper">
                            <Search className="searchIcon" />
                            <input
                                type="text"
                                placeholder="Поиск..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="searchInput"
                            />
                        </div>
                        <div className="filterButtons">
                            {["all", "income", "expense"].map((type) => (
                                <button key={type} onClick={() => setFilterType(type)}
                                    className={`filterButton ${filterType === type
                                        ? type === "all" ? "btnPrimary"
                                            : type === "income" ? "btnIncome" : "btnExpense"
                                        : "btnInactive"}`}>
                                    {type === "all" ? "Все" : type === "income" ? "Доходы" : "Расходы"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Десктоп — таблица */}
            <div className="tableWrapper">
                <div className="tableScroll">
                    <table className="table">
                        <thead className="tableHead">
                            <tr>
                                <th>Дата</th>
                                <th>Название</th>
                                <th>Категория</th>
                                <th>Описание</th>
                                <th className="tableHeadRight">Сумма</th>
                                <th className="tableHeadRight">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="tableBody">
                            {filtered.map((tx) => (
                                <tr key={tx.id}>
                                    <td className="tableDate">
                                        {new Date(tx.transaction_date).toLocaleDateString("ru-RU")}
                                    </td>
                                    <td>
                                        <div className="tableNameCell">
                                            <div className={`iconBadgeSm ${tx.type === "income" ? "iconBadgeIncome" : "iconBadgeExpense"}`}>
                                                {tx.type === "income"
                                                    ? <ArrowUpRight className="iconIncome" />
                                                    : <ArrowDownRight className="iconExpense" />}
                                            </div>
                                            <span className="transactionTitle">{tx.description || "—"}</span>
                                        </div>
                                    </td>
                                    <td className="tableCategory">{tx.category_name || "—"}</td>
                                    <td className="tableDescription">{tx.description || "—"}</td>
                                    <td className={`transactionAmount tableCellRight ${tx.type === "income" ? "textIncome" : "textExpense"}`}>
                                        {tx.type === "income" ? "+" : "-"}{Number(tx.amount).toLocaleString("ru-RU")} KGS
                                    </td>
                                    <td className="tableCellRight">
                                        <div className="actionsWrapper">
                                            <button onClick={() => { setEditingTransaction(tx); setIsModalOpen(true); }} className="btnIcon">
                                                <Edit2 className="iconNeutral" />
                                            </button>
                                            <button onClick={() => handleDelete(tx.id)} className="btnIcon">
                                                <Trash2 className="iconDelete" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="emptyState">Транзакции не найдены</div>
                )}
            </div>

            {/* Мобильный — карточки */}
            <div className="mobileCards">
                {filtered.map((tx) => (
                    <div key={tx.id} className="mobileCard">
                        <div className="mobileCardHeader">
                            <div className="mobileCardMain">
                                <div className={`iconBadgeSm ${tx.type === "income" ? "iconBadgeIncome" : "iconBadgeExpense"}`}>
                                    {tx.type === "income"
                                        ? <ArrowUpRight className="iconIncome" />
                                        : <ArrowDownRight className="iconExpense" />}
                                </div>
                                <div className="mobileCardInfo">
                                    <p className="mobileCardTitle">{tx.description || tx.category_name || "—"}</p>
                                    <p className="mobileCardCategory">{tx.category_name || "Без категории"}</p>
                                </div>
                            </div>
                            <p className={`mobileCardAmount ${tx.type === "income" ? "textIncome" : "textExpense"}`}>
                                {tx.type === "income" ? "+" : "-"}{Number(tx.amount).toLocaleString("ru-RU")} KGS
                            </p>
                        </div>
                        <div className="mobileCardFooter">
                            <span className="mobileCardDate">
                                {new Date(tx.transaction_date).toLocaleDateString("ru-RU")}
                            </span>
                            <div className="mobileCardActions">
                                <button onClick={() => { setEditingTransaction(tx); setIsModalOpen(true); }} className="btnIcon">
                                    <Edit2 className="iconNeutral" />
                                </button>
                                <button onClick={() => handleDelete(tx.id)} className="btnIcon">
                                    <Trash2 className="iconDelete" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="emptyStateMobile">Транзакции не найдены</div>
                )}
            </div>

            {isModalOpen && (
                <TransactionModal
                    transaction={editingTransaction}
                    accounts={accounts}
                    categories={categories}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
