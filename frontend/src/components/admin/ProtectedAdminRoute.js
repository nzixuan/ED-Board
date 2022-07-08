import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./ProtectedRoute.css"
import AdminNotFound from "./AdminNotFound";



function ProtectedAdminRoute({ children }) {

    const [user,] = useContext(UserContext)


    if (user === null || user.role === null)
        return null

    return user.role === "admin" || user.role === "super-admin" ? (
        <Outlet />
    ) : <AdminNotFound />;
}

export default ProtectedAdminRoute;