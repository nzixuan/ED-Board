import React from "react";
import { useContext, useRef } from 'react';
import { Button } from 'primereact/button';
import RosterList from "./RosterList";
import { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Messages } from 'primereact/messages';
import axios from "axios";
import { UserContext } from "../context/UserContext";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export default function CreateRoster() {
    const [user, setUser] = useContext(UserContext)

    const message = useRef(null);

    const handleUpload = (event) => {
        const res = JSON.parse(event.xhr.response)
        setRoster(res.rosters)
    }

    const handleError = (event) => {
        const err = JSON.parse(event.xhr.response)
        if (err.response.data) {
            message.current.show({ severity: 'error', summary: '', detail: err.response.data.message });
        } else {
            message.current.show({ severity: 'error', summary: '', detail: err.message });
        }
    }

    async function handleSubmit() {
        try {
            //TODO: change to user.username
            await axios.post(process.env.REACT_APP_API_URL + '/api/edboard/roster/massCreate', { username: user.username, rosters: roster })
            setRoster([])

        } catch (err) {
            if (err.response.data) {
                message.current.show({ severity: 'error', summary: '', detail: err.response.data.message });
            } else {
                message.current.show({ severity: 'error', summary: '', detail: err.message });
            }
        }
    }

    const [roster, setRoster] = useState([])
    return (
        <div className="flex align-items-center justify-content-center ">
            {roster.length === 0 ? (
                <div>
                    <div className="text-center text-3xl my-5 ">Upload Excel Roster</div>
                    <FileUpload name="Upload Excel" accept=".xls, .xlsx, .csv" url={process.env.REACT_APP_API_URL + "/api/edboard/roster/convert"}
                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                        multiple onUpload={handleUpload} onError={handleError} />
                    <Messages className="w-full mb-3" ref={message}></Messages>
                </div>
            ) : (
                <div>
                    <RosterList roster={roster} setRoster={setRoster} />
                    <Messages className="w-full mb-3" ref={message}></Messages>
                    <Button label="Submit" icon="pi pi-save" className="w-6" onClick={handleSubmit} />
                </div>)}
        </div>
    )
}