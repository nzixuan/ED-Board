import React from "react";
import { useRef } from 'react';
import { Button } from 'primereact/button';
import RosterList from "./RosterList";
import { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Messages } from 'primereact/messages';
import axios from "axios";



export default function CreateRoster() {
    const message = useRef(null);

    const handleUpload = (event) => {
        const rosters = JSON.parse(event.xhr.response)
        setRoster(rosters)
    }

    const handleError = (event) => {
        message.current.show({ severity: 'error', summary: '', detail: JSON.parse(event.xhr.response).message });
    }

    async function handleSubmit() {
        //Query get types
        //For each seet, check if date and type is already in system, if date not in add
        // if date in but type not in add/ if both in then replace with the same type rosters. 
        try {
            const data = await axios.get(process.env.REACT_APP_API_URL + '/api/edboard/roster/createMass')
        } catch (err) {
            message.current.show({ severity: 'error', summary: '', detail: err.message });

        }
    }

    const [roster, setRoster] = useState([])
    return (
        <div className="flex align-items-center justify-content-center ">
            {roster.length == 0 ? (
                <div>
                    <div className="text-center text-3xl my-5 ">Upload Excel Roster</div>
                    <FileUpload name="Upload Excel" accept=".xls, .xlsx, .csv" url={process.env.REACT_APP_API_URL + "/api/edboard/roster/convert"}
                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                        multiple onUpload={handleUpload} />
                    <Messages className="w-full mb-3" ref={message}></Messages>
                </div>
            ) : (
                <div>
                    <RosterList roster={roster} setRoster={setRoster} />
                    <Button label="Submit" icon="pi pi-save" className="w-6" onClick={handleSubmit} />
                </div>)}
        </div>
    )
}