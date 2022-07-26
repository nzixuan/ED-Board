import React from "react";

import { useNavigate } from "react-router-dom";


export default function BoardHeader(props) {
    const navigate = useNavigate();


    return (

        <div className="flex align-content-center align-items-center">
            <div className="flex align-content-center flex-1 justify-content-center">
                <h2 className="ml-2 text-m mr-auto">{props.date}</h2>
            </div>
            <div className="flex align-content-center flex-1 justify-content-center">
                <h1 className="text-2xl cursor-pointer" onClick={() => { navigate("/") }}>
                    {props.name}
                </h1>
            </div>
            <div className="flex align-content-center flex-1 justify-content-center">
                {props.error ?
                    <h2 className="ml-auto pr-2 text-m text-red-500">{"!!! Server Error !!! Last Updated at " + props.time}</h2> :

                    <h2 className="ml-auto pr-2 text-m">{"Updated at " + props.time}</h2>

                }
            </div>

        </div>
    )
}