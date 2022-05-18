import React from "react";
import { Navigate, Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {

    const token = localStorage.getItem("token");
    const isVerified = false
    //Axios 
    console.log("this", token);

    return (
        <Route
            {...restOfProps}
            render={(props) =>
                isVerified ? <Component {...props} /> : <Navigate to="/login" />
            }
        />
    );
}

export default ProtectedRoute;