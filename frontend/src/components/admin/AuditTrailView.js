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
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);


    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });


    const onPage = (event) => {
        setLazyParams(event);
    }

    const loadLazyData = () => {
        setLoading(true);
        axios.get(process.env.REACT_APP_API_URL + '/api/edboard/audit', { params: { auditPerPage: lazyParams.rows, page: lazyParams.page } }).then((res) => {
            setTotalRecords(res.data.total_result);
            setAudits(res.data.audits)
            setLoading(false);

        }).catch((err) => {
            setAudits([])
            setTotalRecords(0);
            setLoading(false);
        })
    }


    useEffect(() => {
        loadLazyData()
    }, [lazyParams]);

    return (
        <div>
            <h2 className="heading">
                Audit Log
            </h2>
            <div className="content" >
                {
                    audits.length > 0 &&
                    <div className="card">
                        < DataTable className="h-full" value={audits} responsiveLayout="scroll"
                            showGridlines stripedRows size="small" lazy paginator first={lazyParams.first} rows={lazyParams.rows} totalRecords={totalRecords}
                            onPage={onPage} >
                            <Column field="username" header="User" headerClassName="header"></Column>
                            <Column header="Operation Time" body={dateTemplate} headerClassName="header"></Column>
                            <Column field="type" header="Operation Type" headerClassName="header"></Column>
                            <Column header="Roster Date" body={documentTemplate} headerClassName="header"></Column>
                        </DataTable>
                    </div>
                }
            </div >
        </div>

    )
}
