import { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./TransactionModal.css";

export function TransactionModal({ transaction, accounts, categories, onClose, onSave }) {
    const [form, setForm] = useState({
        account_id: accounts[0]?.id || "",
        category_id: "",
        amount: "",
        type: "expense",
        description: "",
        transaction_date: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        if (transaction) {
            setForm({
                account_id: transaction.account_id || accounts[0]?.id || "",
                category_id: transaction.category_id || "",
                amount: String(Math.abs(transaction.amount)),
                type: transaction.type,
                description: transaction.description || "",
                transaction_date: transaction.transaction_date
                    ? transaction.transaction_date.split("T")[0]
                    : new Date().toISOString().split("T")[0],
            });
        }
    }, [transaction]);

    const filteredCategories = categories.filter(c => c.type === form.type);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...form, amount: parseFloat(form.amount) });
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <div className="modalHeader">
                    <h3 className="modalTitle">
                        {transaction ? "Редактировать транзакцию" : "Добавить транзакцию"}
                    </h3>
                    <button onClick={onClose} className="btnIcon"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="modalForm">
                    <div className="formGroup">
                        <label className="formLabel">Тип транзакции</label>
                        <div className="typeSelector">
                            <button type="button"
                                onClick={() => setForm({ ...form, type: "income", category_id: "" })}
                                className={`typeButton ${form.type === "income" ? "btnIncome" : "btnInactive"}`}>
                                Доход
                            </button>
                            <button type="button"
                                onClick={() => setForm({ ...form, type: "expense", category_id: "" })}
                                className={`typeButton ${form.type === "expense" ? "btnExpense" : "btnInactive"}`}>
                                Расход
                            </button>
                        </div>
                    </div>

                    <div className="formGroup">
                        <label className="formLabel">Счёт</label>
                        <select value={form.account_id}
                            onChange={(e) => setForm({ ...form, account_id: e.target.value })}
                            className="formSelect" required>
                            {accounts.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.name} ({Number(a.balance).toLocaleString("ru-RU")} {a.currency})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="formGroup">
                        <label className="formLabel">Сумма</label>
                        <input type="number" step="0.01" min="0.01"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            className="formInput" placeholder="0.00" required />
                    </div>

                    <div className="formGroup">
                        <label className="formLabel">Категория</label>
                        <select value={form.category_id}
                            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                            className="formSelect">
                            <option value="">— Без категории —</option>
                            {filteredCategories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="formGroup">
                        <label className="formLabel">Дата</label>
                        <input type="date" value={form.transaction_date}
                            onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
                            className="formInput" required />
                    </div>

                    <div className="formGroup">
                        <label className="formLabel">Описание</label>
                        <textarea value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="formTextarea" rows={3}
                            placeholder="Опциональное описание" />
                    </div>

                    <div className="modalActions">
                        <button type="button" onClick={onClose} className="modalCancelButton">Отмена</button>
                        <button type="submit" className="modalSubmitButton">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    );
}