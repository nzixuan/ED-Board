import React, { useContext, useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from 'axios'
import { UserContext } from "../../context/UserContext";
import SideNavBar from "./SideNavBar";
import "./ProtectedRoute.css"
import AdminNotFound from "./AdminNotFound";



function ProtectedAdminRoute({ children }) {

    const [user, setUser] = useContext(UserContext)


    if (user === null || user.role === null)
        return null

    return user.role === "admin" || user.role === "super-admin" ? (
        <Outlet />
    ) : <AdminNotFound />;
}

export default ProtectedAdminRoute;