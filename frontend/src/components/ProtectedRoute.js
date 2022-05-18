import React, { useState, useEffect } from "react";
import { Navigate, Route, Outlet } from "react-router-dom";
import axios from 'axios'

function ProtectedRoute({ children }) {

    const [loggedIn, setLoggedIn] = useState(null);
    useEffect(() => {

        const token = localStorage.getItem('token');

        axios
            .get(process.env.REACT_APP_API_URL + '/api/edboard/user/verify', { headers: { token: token } })
            .then((res) => {
                setLoggedIn(res.data.isLoggedIn);
            })
            .catch((err) => {
                setLoggedIn(false);
            })
        console.log("logged in?", loggedIn);
    });

    if (!loggedIn)
        return <Navigate to="/login" />

    return <Outlet />;
}

export default ProtectedRoute;