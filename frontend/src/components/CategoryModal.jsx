import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
    ShoppingCart, Car, Gamepad2, Home, Heart, BookOpen,
    Briefcase, Laptop, Gift, TrendingUp, Utensils, Shirt,
    Music, Plane, Coffee, Dumbbell, Dog, Baby, Tv, Wifi,
    Tag, Star, Zap, DollarSign, CreditCard, Wallet,
} from "lucide-react";

const ICONS = [
    { name: "shopping-cart", Icon: ShoppingCart },
    { name: "car", Icon: Car },
    { name: "gamepad", Icon: Gamepad2 },
    { name: "home", Icon: Home },
    { name: "heart", Icon: Heart },
    { name: "book", Icon: BookOpen },
    { name: "briefcase", Icon: Briefcase },
    { name: "laptop", Icon: Laptop },
    { name: "gift", Icon: Gift },
    { name: "trending-up", Icon: TrendingUp },
    { name: "utensils", Icon: Utensils },
    { name: "shirt", Icon: Shirt },
    { name: "music", Icon: Music },
    { name: "plane", Icon: Plane },
    { name: "coffee", Icon: Coffee },
    { name: "dumbbell", Icon: Dumbbell },
    { name: "dog", Icon: Dog },
    { name: "baby", Icon: Baby },
    { name: "tv", Icon: Tv },
    { name: "wifi", Icon: Wifi },
    { name: "tag", Icon: Tag },
    { name: "star", Icon: Star },
    { name: "zap", Icon: Zap },
    { name: "dollar", Icon: DollarSign },
    { name: "credit-card", Icon: CreditCard },
    { name: "wallet", Icon: Wallet },
];

const COLORS = [
    "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
    "#f97316", "#eab308", "#22c55e", "#14b8a6",
    "#06b6d4", "#3b82f6", "#10b981", "#84cc16",
];

export function CategoryModal({ category, onClose, onSave }) {
    const [form, setForm] = useState({
        name: "",
        type: "expense",
        color: "#6366f1",
        icon: "tag",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        if (category) {
            setForm({
                name: category.name,
                type: category.type,
                color: category.color || "#6366f1",
                icon: category.icon || "tag",
            });
        }
    }, [category]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return setError("Введите название");
        setError("");
        onSave(form);
    };

    const PreviewIcon = ICONS.find(i => i.name === form.icon)?.Icon || Tag;

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <div className="modalHeader">
                    <h3 className="modalTitle">
                        {category ? "Редактировать категорию" : "Добавить категорию"}
                    </h3>
                    <button onClick={onClose} className="btnIcon"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="modalForm">
                    {error && (
                        <div style={{
                            background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
                            padding: "10px 14px", borderRadius: "8px", marginBottom: "12px", fontSize: "14px"
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="formGroup">
                        <label className="formLabel">Тип категории</label>
                        <div className="typeSelector">
                            <button type="button"
                                onClick={() => setForm({ ...form, type: "income" })}
                                className={`typeButton ${form.type === "income" ? "btnIncome" : "btnInactive"}`}>
                                Доход
                            </button>
                            <button type="button"
                                onClick={() => setForm({ ...form, type: "expense" })}
                                className={`typeButton ${form.type === "expense" ? "btnExpense" : "btnInactive"}`}>
                                Расход
                            </button>
                        </div>
                    </div>

                    <div className="formGroup">
                        <label className="formLabel">Название</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="formInput"
                            placeholder="Например: Продукты"
                            required
                        />
                    </div>

                    <div className="formGroup">
                        <label className="formLabel">Превью</label>
                        <div style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0"
                        }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "10px", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                backgroundColor: `${form.color}20`
                            }}>
                                <PreviewIcon size={22} color={form.color} />
                            </div>
                            <span style={{ fontSize: "15px", fontWeight: "500", color: "#1e293b" }}>
                                {form.name || "Название категории"}
                            </span>
                        </div>
                    </div>

                    <div className="formGroup">
                        <label className="formLabel">Цвет</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {COLORS.map((color) => (
                                <button key={color} type="button"
                                    onClick={() => setForm({ ...form, color })}
                                    style={{
                                        width: "30px", height: "30px", borderRadius: "50%",
                                        background: color, border: "none", cursor: "pointer",
                                        outline: form.color === color ? `3px solid ${color}` : "none",
                                        outlineOffset: "2px",
                                        transform: form.color === color ? "scale(1.15)" : "scale(1)",
                                        transition: "all 0.15s",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="formGroup">
                        <label className="formLabel">Иконка</label>
                        <div style={{
                            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(44px, 1fr))",
                            gap: "8px", maxHeight: "160px", overflowY: "auto", padding: "4px"
                        }}>
                            {ICONS.map(({ name, Icon }) => (
                                <button key={name} type="button"
                                    onClick={() => setForm({ ...form, icon: name })}
                                    title={name}
                                    style={{
                                        width: "44px", height: "44px", borderRadius: "8px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        border: form.icon === name ? `2px solid ${form.color}` : "2px solid #e2e8f0",
                                        background: form.icon === name ? `${form.color}15` : "#f8fafc",
                                        cursor: "pointer", transition: "all 0.15s",
                                    }}>
                                    <Icon size={18} color={form.icon === name ? form.color : "#64748b"} />
                                </button>
                            ))}
                        </div>
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