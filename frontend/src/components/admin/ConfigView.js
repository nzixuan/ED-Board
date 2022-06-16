import React, { useContext } from "react";
import { useState, useEffect, useRef } from 'react';
import { UserContext } from "../../context/UserContext";
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InputTextarea } from 'primereact/inputtextarea';
import { Messages } from 'primereact/messages';


function ConfigView() {
    const [config, setConfig] = useState({ boards: "{}", boardNames: "{}" });

    const [user,] = useContext(UserContext)
    const navigate = useNavigate();

    const message = useRef(null);


    useEffect(() => {
        axios.get(process.env.REACT_APP_API_URL + '/api/edboard/config').then((res) => {
            console.log(res.data)
            setConfig({ boards: JSON.stringify(res.data.boards, undefined, 4), boardNames: JSON.stringify(res.data.boardNames, undefined, 4) })

        }).catch((err) => {
            setConfig({})

        })
    }, []);

    const handleSubmit = () => {

        try {
            const boards = JSON.parse(config.boards)
            const boardNames = JSON.parse(config.boardNames)
            axios.post(process.env.REACT_APP_API_URL + '/api/edboard/config',
                { username: user.username, boards: boards, boardNames: boardNames }).then((res) => {
                    navigate("/admin")
                }).catch((err) => {
                    if (err.response.data) {
                        message.current.show({ severity: 'error', summary: '', detail: err.response.data.message });
                    } else {
                        message.current.show({ severity: 'error', summary: '', detail: "Server Error" });
                    }
                })
        } catch (err) {
            console.log(err)
            message.current.show({ severity: 'error', summary: '', detail: err.message });
        }

    }


    return (
        <div className="flex align-items-center justify-content-center ">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-5 my-6">
                <div className="mb-5">
                    Board Assignments
                </div>
                <InputTextarea rows={20} cols={50} value={config.boards} onChange={(e) => setConfig({ ...config, boards: e.target.value })} />
                {/* <div className="mb-5">
                    Board Names
                </div> */}
                <Messages className="w-full mb-3" ref={message}></Messages>
                <Button label="Save" icon="pi pi-save" className="w-4 mb-1" onClick={handleSubmit} />
            </div>
        </div>
    )
}

export default ConfigView;