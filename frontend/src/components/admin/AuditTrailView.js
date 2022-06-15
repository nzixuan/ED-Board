import React from "react";
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from "axios";

import './AuditTrailView.css'

function dateTemplate(rowData) {
    return new Date(rowData.createdAt).toLocaleString()
}

function documentTemplate(rowData) {
    if (rowData.documentId)
        return new Date(rowData.documentId.date).toLocaleDateString()
    return ""
}

export default function AuditTrailView(props) {

    const [audits, setAudits] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_API_URL + '/api/edboard/audit').then((res) => {
            console.log(res.data)
            setAudits(res.data.audits)
        }).catch((err) => { setAudits([]) })
    }, []);

    return (
        <div className="Card" >
            {
                audits.length > 0 &&
                < DataTable className="Table" value={audits} header="Audit Trail" responsiveLayout="scroll"
                    showGridlines stripedRows size="small" >
                    <Column className="py-2 px-1 font-bold " field="username" header="User" headerClassName="header"></Column>
                    <Column className="py-1 px-1" header="Operation Time" body={dateTemplate} headerClassName="header"></Column>
                    <Column className="py-1 px-1" field="type" header="Operation Type" headerClassName="header"></Column>
                    <Column className="py-1 px-1" header="Roster Date" body={documentTemplate} headerClassName="header"></Column>
                </DataTable>
            }
        </div >


    )
}
