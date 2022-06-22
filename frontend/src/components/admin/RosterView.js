import React from "react";
import { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from "axios";

// function dateTemplate(rowData) {
//     return new Date(rowData.createdAt).toLocaleString()
// }

// function documentTemplate(rowData) {
//     if (rowData.documentId)
//         return new Date(rowData.documentId.date).toLocaleDateString()
//     return ""
// }

export default function RosterView(props) {

    const [rosters, setRosters] = useState([]);

    // useEffect(() => {
    //     axios.get(process.env.REACT_APP_API_URL + '/api/edboard/config').then((res) => {
    //         console.log(res.data)
    //         setConfig({ boards: JSON.stringify(res.data.boards, undefined, 4), boardNames: JSON.stringify(res.data.boardNames, undefined, 4) })

    //     }).catch((err) => {
    //         setConfig({})

    //     })
    // }, []);

    const TABS = [{ header: "Doctor Roster" }, { header: "Nurse Roster" }]

    return (
        <div className="flex h-full align-items-start justify-content-start w-full bg-white">
            <TabView className="w-full">
                {TABS.map((element, index) => {
                    return <TabPanel header={element.header} key={index} headerClassName="text-2xl">

                    </TabPanel>
                })}


            </TabView>

            {
                rosters.length > 0 &&
                <div className="w-full mt-3">
                    {/* < DataTable className="h-full" value={audits} header="Audit Trail" responsiveLayout="scroll"
                        showGridlines stripedRows size="small" lazy paginator first={lazyParams.first} rows={lazyParams.rows} totalRecords={totalRecords}
                        onPage={onPage} >
                        <Column className="py-2 px-1 font-bold" field="username" header="User" headerClassName="header"></Column>
                        <Column className="py-1 px-1" header="Operation Time" body={dateTemplate} headerClassName="header"></Column>
                        <Column className="py-1 px-1" field="type" header="Operation Type" headerClassName="header"></Column>
                        <Column className="py-1 px-1" header="Roster Date" body={documentTemplate} headerClassName="header"></Column>
                    </DataTable> */}
                </div>
            }
        </div >


    )
}
