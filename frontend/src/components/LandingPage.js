import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

export default function LandingPage(props) {
    const navigate = useNavigate();

    return (<div className="flex flex-column justify-content-center align-items-center text-center">
        <h1 className="text-3xl cursor-pointer" onClick={() => navigate("/admin")}>
            ED Board
        </h1>
        <div className="flex flex-wrap justify-content-center align-items-center">
            {
                props.boards.map((board) => { return <Button className="m-4 text-xl w-3 h-3rem" label={board} key={board} onClick={() => { navigate("/" + board) }}></Button> })
            }
        </div>
        <Button className="p-button p-button-help" label="Go to Admin View" onClick={() => { navigate("/admin") }}></Button>
    </div>)
}