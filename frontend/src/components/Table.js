import React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import './Table.css'

function nameTemplate(field) {
    return (rowData) => {
        if (rowData.hasOwnProperty(field))
            return rowData[field].name;
        return ""
    }
}

export default function Table(props) {


    return (
        <div className="p-2">
            {
                props.roster &&
                < DataTable value={props.roster["roster"]} header={(props.roster.staffType).toUpperCase()} responsiveLayout="scroll"
                    showGridlines rowGroupMode="rowspan" groupRowsBy="assignment" size="small" rowClassName={(data) => { return data.stripe }}>
                    <Column className="py-2 px-1 font-bold " field="assignment" header="Assignment" headerClassName="header"></Column>
                    <Column className="py-1 px-1" header="AM" body={nameTemplate("am")} headerClassName="header"></Column>
                    {props.roster.staffType === "doctor" &&
                        <Column className="py-1 px-1" header="Straddle" body={nameTemplate("straddle1")} headerClassName="header"></Column>
                    }
                    <Column className="py-1 px-1" header="PM" body={nameTemplate("pm")} headerClassName="header"></Column>
                    {props.roster.staffType === "doctor" &&
                        <Column className="py-1 px-1" header="Straddle" body={nameTemplate("straddle2")} headerClassName="header"></Column>
                    }
                    <Column className="py-1 px-1" header="ND" body={nameTemplate("nd")} headerClassName="header"></Column>
                </DataTable>
            }
        </div >


    )
}