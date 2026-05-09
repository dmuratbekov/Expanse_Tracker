import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./pages/LoginPage";
import { Register } from "./pages/RegisterPage";
import { Dashboard } from "./pages/DashboardPage";
import { Transactions } from "./pages/TransactionsPage";
import { Categories } from "./pages/CategoriesPage";
import { Analytics } from "./pages/AnalyticsPage";
import { Layout } from "./components/Layout";
import { AuthProvider, useAuth } from "./context/AuthContext";

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#6366f1" }}>
            Загрузка...
        </div>
    );
    return user ? children : <Navigate to="/login" replace />;
}

function WithAuth({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <WithAuth><Login /></WithAuth>,
    },
    {
        path: "/register",
        element: <WithAuth><Register /></WithAuth>,
    },
    {
        path: "/",
        element: (
            <WithAuth>
                <PrivateRoute>
                    <Layout />
                </PrivateRoute>
            </WithAuth>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: "transactions", element: <Transactions /> },
            { path: "categories", element: <Categories /> },
            { path: "analytics", element: <Analytics /> },
        ],
    },
]);