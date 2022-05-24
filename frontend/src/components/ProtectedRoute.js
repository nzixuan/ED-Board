import React, { useContext, useState, useEffect } from "react";
import { Navigate, Route, Outlet } from "react-router-dom";
import axios from 'axios'
import { UserContext } from "../context/UserContext";

function ProtectedRoute({ children }) {

    const [user, setUser] = useContext(UserContext)

    const [loggedIn, setLoggedIn] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');

        axios
            .get(process.env.REACT_APP_API_URL + '/api/edboard/user/verify', { headers: { token: token } })
            .then((res) => {
                setLoggedIn(res.data.isLoggedIn);
                if (user.username != res.data.username)
                    setUser({ username: res.data.username, role: res.data.role })
            })
            .catch((err) => {
                setLoggedIn(false);
            })
    });

    if (loggedIn == null)
        return null

    return loggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;