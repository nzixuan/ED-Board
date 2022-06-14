import React from "react";

import { useNavigate } from "react-router-dom";


export default function BoardHeader(props) {
    const navigate = useNavigate();


    return (

        <div className="flex justify-content-center align-content-end align-items-end">
            <h2 className="mx-2 text-sm">{"Monday, 05/26/2022"}</h2>
            <div className="flex-grow-1 flex justify-content-center align-items-end">
                <h1 className="text-2xl cursor-pointer" onClick={() => { navigate("/") }}>
                    {props.name}
                </h1>
                <h3 className="px-2 text-xs font-normal ">{"Updated at " + props.time.toLocaleTimeString()}</h3>
            </div>

        </div>
    )
}