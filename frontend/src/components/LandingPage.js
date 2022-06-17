import React from "react";
import { useNavigate } from "react-router-dom";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Button } from "primereact/button";

export default function LandingPage(props) {
    const navigate = useNavigate();

    return (<div className="flex flex-column justify-content-center align-items-center text-center">
        <h1 className="text-3xl cursor-pointer" onClick={() => navigate("/admin")}>
            ED Board
        </h1>

        {
            props.boards.map((board) => { return <Button className="m-4 text-xl w-2 h-3rem" label={board} key={board} onClick={() => { navigate("/" + board) }}></Button> })
        }
    </div>)
}