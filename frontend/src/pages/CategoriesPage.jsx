import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, FolderOpen, Tag } from "lucide-react";
import {
    ShoppingCart, Car, Gamepad2, Home, Heart, BookOpen,
    Briefcase, Laptop, Gift, TrendingUp, Utensils, Shirt,
    Music, Plane, Coffee, Dumbbell, Dog, Baby, Tv, Wifi,
    Star, Zap, DollarSign, CreditCard, Wallet,
} from "lucide-react";
import { CategoryModal } from "../components/CategoryModal";
import api from "../api/axios";
import "./Categories.css";
import "./Dashboard.css";

const ICON_MAP = {
    "shopping-cart": ShoppingCart,
    "car": Car,
    "gamepad": Gamepad2,
    "home": Home,
    "heart": Heart,
    "book": BookOpen,
    "briefcase": Briefcase,
    "laptop": Laptop,
    "gift": Gift,
    "trending-up": TrendingUp,
    "utensils": Utensils,
    "shirt": Shirt,
    "music": Music,
    "plane": Plane,
    "coffee": Coffee,
    "dumbbell": Dumbbell,
    "dog": Dog,
    "baby": Baby,
    "tv": Tv,
    "wifi": Wifi,
    "tag": Tag,
    "star": Star,
    "zap": Zap,
    "dollar": DollarSign,
    "credit-card": CreditCard,
    "wallet": Wallet,
};

function CategoryIcon({ icon, color, size = 22 }) {
    const Icon = ICON_MAP[icon] || Tag;
    return <Icon size={size} color={color} />;
}

export function Categories() {
    const [categories, setCategories] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data.categories);
        } catch (err) {
            setError("Не удалось загрузить категории");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingCategory) {
                const res = await api.put(`/categories/${editingCategory.id}`, formData);
                setCategories(categories.map(c =>
                    c.id === editingCategory.id ? res.data.category : c
                ));
            } else {
                const res = await api.post("/categories", formData);
                setCategories([...categories, res.data.category]);
            }
            setIsModalOpen(false);
            setEditingCategory(null);
        } catch (err) {
            setError(err.response?.data?.error || "Ошибка сохранения");
        }
    };

    const handleEdit = (cat) => {
        setEditingCategory(cat);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить категорию?")) return;
        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter(c => c.id !== id));
        } catch {
            setError("Не удалось удалить категорию");
        }
    };

    const filtered = categories.filter(c => filterType === "all" || c.type === filterType);
    const expenseList = filtered.filter(c => c.type === "expense");
    const incomeList = filtered.filter(c => c.type === "income");

    if (loading) return <div style={{ padding: "40px", color: "#6366f1" }}>Загрузка...</div>;

    return (
        <div className="categoriesContainer">
            <div className="pageHeader">
                <div className="headerWrapper">
                    <div>
                        <h1 className="pageTitle">Категории</h1>
                        <p className="pageSubtitle">Управление категориями доходов и расходов</p>
                    </div>
                    <button onClick={handleAdd} className="addButton">
                        <Plus className="addIcon" /><span>Добавить</span>
                    </button>
                </div>

                {error && (
                    <div style={{
                        background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
                        padding: "10px 14px", borderRadius: "8px", margin: "12px 0", fontSize: "14px"
                    }}>
                        {error}
                    </div>
                )}

                <div className="filterButtons">
                    {[
                        { key: "all", label: "Все" },
                        { key: "income", label: "Доходы" },
                        { key: "expense", label: "Расходы" },
                    ].map(({ key, label }) => (
                        <button key={key} onClick={() => setFilterType(key)}
                            className={`filterButton ${filterType === key
                                ? key === "all" ? "btnPrimary" : key === "income" ? "btnIncome" : "btnExpense"
                                : "btnInactive"}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="sectionsWrapper">
                {expenseList.length > 0 && (
                    <div>
                        <h3 className="sectionTitle">Категории расходов</h3>
                        <div className="categoriesGrid">
                            {expenseList.map((cat) => (
                                <div key={cat.id} className="categoryCard">
                                    <div className="categoryHeader">
                                        <div className="categoryIconWrapper"
                                            style={{ backgroundColor: `${cat.color}20` }}>
                                            <CategoryIcon icon={cat.icon} color={cat.color} />
                                        </div>
                                        <div className="categoryActions">
                                            <button className="btnIcon" onClick={() => handleEdit(cat)}>
                                                <Edit2 className="iconNeutral" />
                                            </button>
                                            <button className="btnIcon" onClick={() => handleDelete(cat.id)}>
                                                <Trash2 className="iconDelete" />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="categoryName">{cat.name}</h4>
                                    <div className="categoryCount">
                                        <FolderOpen className="categoryCountIcon" />
                                        <span>Категория расходов</span>
                                    </div>
                                    <div className="categoryFooter">
                                        <div className="categoryBar" style={{ backgroundColor: cat.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {incomeList.length > 0 && (
                    <div>
                        <h3 className="sectionTitle">Категории доходов</h3>
                        <div className="categoriesGrid">
                            {incomeList.map((cat) => (
                                <div key={cat.id} className="categoryCard">
                                    <div className="categoryHeader">
                                        <div className="categoryIconWrapper"
                                            style={{ backgroundColor: `${cat.color}20` }}>
                                            <CategoryIcon icon={cat.icon} color={cat.color} />
                                        </div>
                                        <div className="categoryActions">
                                            <button className="btnIcon" onClick={() => handleEdit(cat)}>
                                                <Edit2 className="iconNeutral" />
                                            </button>
                                            <button className="btnIcon" onClick={() => handleDelete(cat.id)}>
                                                <Trash2 className="iconDelete" />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="categoryName">{cat.name}</h4>
                                    <div className="categoryCount">
                                        <FolderOpen className="categoryCountIcon" />
                                        <span>Категория доходов</span>
                                    </div>
                                    <div className="categoryFooter">
                                        <div className="categoryBar" style={{ backgroundColor: cat.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                        Категорий пока нет
                    </div>
                )}
            </div>

            {isModalOpen && (
                <CategoryModal
                    category={editingCategory}
                    onClose={() => { setIsModalOpen(false); setEditingCategory(null); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}