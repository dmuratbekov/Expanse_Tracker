import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.error || "Неверный email или пароль");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loginContainer">
            <div className="loginWrapper">
                <div className="loginHeader">
                    <h1 className="loginTitle">FinTrack</h1>
                    <p className="loginSubtitle">Войдите в свой аккаунт</p>
                </div>

                <div className="loginCard">
                    {error && (
                        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="loginForm">
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

                        <button type="submit" className="btn btnPrimary" disabled={loading}>
                            {loading ? "Входим..." : "Войти"}
                        </button>
                    </form>

                    <div className="authFooter">
                        Нет аккаунта?{" "}
                        <Link to="/register" className="link">Зарегистрироваться</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}