import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, Mail, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Register.css";
import "./Login.css";

export function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) return setError("Пароли не совпадают");
        if (password.length < 6) return setError("Пароль минимум 6 символов");
        setLoading(true);
        try {
            await register(email, password, name);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.error || "Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registerContainer">
            <div className="registerWrapper">
                <div className="loginHeader">
                    <h1 className="loginTitle">Создать аккаунт</h1>
                    <p className="loginSubtitle">Начните управлять своими финансами</p>
                </div>

                <div className="loginCard">
                    {error && (
                        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="registerForm">
                        <div className="formGroup">
                            <label htmlFor="name" className="formLabel">Имя</label>
                            <div className="inputWrapper">
                                <User className="inputIcon" />
                                <input id="name" type="text" value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="formInput formInputWithIcon"
                                    placeholder="Иван Иванов" required />
                            </div>
                        </div>
                        <div className="formGroup">
                            <label htmlFor="email" className="formLabel">Email</label>
                            <div className="inputWrapper">
                                <Mail className="inputIcon" />
                                <input id="email" type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="formInput formInputWithIcon"
                                    placeholder="example@email.com" required />
                            </div>
                        </div>
                        <div className="formGroup">
                            <label htmlFor="password" className="formLabel">Пароль</label>
                            <div className="inputWrapper">
                                <Lock className="inputIcon" />
                                <input id="password" type="password" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="formInput formInputWithIcon"
                                    placeholder="••••••••" required />
                            </div>
                        </div>
                        <div className="formGroup">
                            <label htmlFor="confirmPassword" className="formLabel">Подтвердите пароль</label>
                            <div className="inputWrapper">
                                <Lock className="inputIcon" />
                                <input id="confirmPassword" type="password" value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="formInput formInputWithIcon"
                                    placeholder="••••••••" required />
                            </div>
                        </div>
                        <button type="submit" className="btn btnPrimary" disabled={loading}>
                            {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
                        </button>
                    </form>

                    <div className="authFooter">
                        Уже есть аккаунт?{" "}
                        <Link to="/login" className="link">Войти</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}