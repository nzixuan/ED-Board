import React, { useContext, useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from 'axios'
import { UserContext } from "../../context/UserContext";
import SideNavBar from "./SideNavBar";
import "./ProtectedRoute.css"


function ProtectedRoute({ children }) {

    const [user, setUser] = useContext(UserContext)

    const [loggedIn, setLoggedIn] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');

        axios
            .get(process.env.REACT_APP_API_URL + '/api/edboard/user/verify', { headers: { token: token } })
            .then((res) => {
                setLoggedIn(res.data.isLoggedIn);
                if (user.username !== res.data.username)
                    setUser({ username: res.data.username, role: res.data.role })
            })
            .catch((err) => {
                setLoggedIn(false);
            })
    });

    if (loggedIn == null)
        return null

    return loggedIn ? (
        <div className="page">
            <SideNavBar></SideNavBar>
            <div className="dashboard" >
                <Outlet /></div></div>
    ) : <Navigate to="/login" />;
}

export default ProtectedRoute;