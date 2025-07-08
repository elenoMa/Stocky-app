import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Movements from "../pages/Movements";
import Categories from "../pages/Categories";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/movements" element={<Movements />} />
                <Route path="/categories" element={<Categories />} />
            </Routes>
        </BrowserRouter>
    )
}