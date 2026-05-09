import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Receipt, FolderOpen, TrendingUp, LogOut, Menu, X, Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

export function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navigation = [
        { name: "Панель управления", href: "/", icon: LayoutDashboard },
        { name: "Транзакции", href: "/transactions", icon: Receipt },
        { name: "Категории", href: "/categories", icon: FolderOpen },
        { name: "Аналитика", href: "/analytics", icon: TrendingUp },
    ];

    return (
        <div className="layoutContainer">
            <div className="mobileHeader">
                <div className="headerLogo">
                    <div className="logoIconWrapper"><Wallet className="logoIcon" /></div>
                    <span className="logoText">FinTrack</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="menuButton">
                    {isMobileMenuOpen ? <X className="menuIcon" /> : <Menu className="menuIcon" />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="mobileOverlay" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            <aside className={`sidebar ${!isMobileMenuOpen ? "sidebarHidden" : ""}`}>
                <div className="sidebarHeader">
                    <div className="sidebarLogo">
                        <div className="logoIconWrapper"><Wallet className="logoIcon" /></div>
                        <h2 className="sidebarTitle">FinTrack</h2>
                    </div>
                    <p className="sidebarSubtitle">Управление финансами</p>

                </div>

                <nav className="sidebarNav">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link key={item.name} to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`navLink ${isActive ? "navLinkActive" : "navLinkInactive"}`}>
                                <item.icon className="navIcon" />
                                <span className="navText">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebarFooter">
                    {user && (
                        <div className="sidebarUser">
                            <div className="sidebarUserAvatar">
                                {user.full_name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="sidebarUserName">{user.full_name}</span>
                        </div>
                    )}
                    <button onClick={handleLogout}
                        className="navLink navLinkInactive"
                        style={{ background: "none", border: "none", width: "100%", cursor: "pointer", textAlign: "left" }}>
                        <LogOut className="navIcon" />
                        <span className="navText">Выход</span>
                    </button>
                </div>
            </aside>

            <main className="mainContent">
                <Outlet />
            </main>
        </div>
    );
}