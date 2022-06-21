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
            console.log(res.data)
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
        <div className="flex h-full align-items-start justify-content-center" >
            {
                audits.length > 0 &&
                <div className="Card w-8 mt-3">
                    < DataTable className="h-full" value={audits} header="Audit Trail" responsiveLayout="scroll"
                        showGridlines stripedRows size="small" lazy paginator first={lazyParams.first} rows={lazyParams.rows} totalRecords={totalRecords}
                        onPage={onPage} >
                        <Column className="py-2 px-1 font-bold" field="username" header="User" headerClassName="header"></Column>
                        <Column className="py-1 px-1" header="Operation Time" body={dateTemplate} headerClassName="header"></Column>
                        <Column className="py-1 px-1" field="type" header="Operation Type" headerClassName="header"></Column>
                        <Column className="py-1 px-1" header="Roster Date" body={documentTemplate} headerClassName="header"></Column>
                    </DataTable>
                </div>
            }
        </div >


    )
}
