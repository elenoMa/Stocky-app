import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Movements from "../pages/Movements";
import Categories from "../pages/Categories";
import Users from "../pages/Users";
import Suppliers from "../pages/Suppliers";
import Tasks from '../pages/Tasks';
import ProtectedRoute from "./ProtectedRoute";
import Error404 from '../pages/Error404';
import Error500 from '../pages/Error500';
import DashboardLayout from '../components/DashboardLayout';

function getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function ProtectedLayout() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <Outlet />
            </DashboardLayout>
        </ProtectedRoute>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={getToken() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/movements" element={<Movements />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/tasks" element={<Tasks />} />
                </Route>
                <Route path="/error-500" element={<Error500 />} />
                <Route path="*" element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    )
}