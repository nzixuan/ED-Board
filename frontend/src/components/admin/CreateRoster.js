import React from "react";
import { useContext, useRef } from 'react';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Messages } from 'primereact/messages';
import axios from "axios";
import { UserContext } from "../../context/UserContext";

import PreviewAddTabs from "./PreviewAddTabs";

export default function CreateRoster(props) {

    const [user,] = useContext(UserContext)

    const message = useRef(null);

    const handleUpload = (event) => {
        const res = JSON.parse(event.xhr.response)
        setRostersList(res.rosters)
    }

    const handleError = (event) => {
        if (event.xhr.response) {
            // const err = JSON.parse(event.xhr.response)
            console.log(event.xhr.response)
            message.current.show({ severity: 'error', summary: '', detail: "Invalid input format" });

        } else {
            console.log("No response")
            message.current.show({ severity: 'error', summary: '', detail: "Server Error" });

        }

    }

    async function handleSubmit() {
        try {
            const token = localStorage.getItem('token');
            await axios.post(process.env.REACT_APP_API_URL + '/api/edboard/roster/massCreate', { username: user.username, rosters: rostersList }, { headers: { token: token } }
            )
            props.setDisplayDialog(false)

        } catch (err) {
            console.log(err)
            message.current.show({ severity: 'error', summary: '', detail: err.message });
        }
    }

    const [rostersList, setRostersList] = useState([])
    return (
        <div className="flex align-items-center justify-content-center w-full">
            {rostersList.length === 0 ? (
                <div>
                    <div className="text-center text-3xl my-5">Upload Excel Roster</div>
                    <FileUpload name="Upload Excel" accept=".xls, .xlsx, .csv" url={process.env.REACT_APP_API_URL + "/api/edboard/roster/convert"}
                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                        multiple onUpload={handleUpload} onError={handleError}
                    />
                    <Messages className="w-full mb-3" ref={message}></Messages>
                </div>
            ) : (
                <div>
                    <PreviewAddTabs rostersList={rostersList} setRostersList={setRostersList} />
                    <Messages className="w-full mb-3" ref={message}></Messages>
                    <Button label="Submit" icon="pi pi-save" className="w-3" onClick={handleSubmit} />
                </div>)}
        </div>
    )
}