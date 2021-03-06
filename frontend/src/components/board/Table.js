import React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import './Table.css'

function nameTemplate(field) {
    return (rowData) => {
        if (rowData.hasOwnProperty(field)) {
            // const words = rowData[field].name.toLowerCase().split(" ");

            // return words.map((word) => {
            //     return word[0].toUpperCase() + word.substring(1);
            // }).join(" ");

            return rowData[field].name.toUpperCase()
        }
        return ""
    }
}

export default function Table(props) {


    return (
        <div className="table-card" >
            {
                props.roster &&
                < DataTable className={"table " + props.className} value={props.roster["roster"]} header={(props.roster.staffType).toUpperCase()} responsiveLayout="scroll"
                    showGridlines rowGroupMode="rowspan" groupRowsBy="assignment" size="small" rowClassName={(data) => { return data.stripe }}>
                    <Column className="assignment-column" field="assignment" header="Assignment" headerClassName="header"></Column>
                    <Column className="data-column" header="AM" body={nameTemplate("am")} headerClassName="header"></Column>
                    {props.roster.staffType === "doctor" &&
                        <Column className="data-column" header="Straddle" body={nameTemplate("straddle1")} headerClassName="header"></Column>
                    }
                    <Column className="data-column" header="PM" body={nameTemplate("pm")} headerClassName="header"></Column>
                    {props.roster.staffType === "doctor" &&
                        <Column className="data-column" header="Straddle" body={nameTemplate("straddle2")} headerClassName="header"></Column>
                    }
                    <Column className="data-column" header="ND" body={nameTemplate("nd")} headerClassName="header"></Column>
                </DataTable>
            }
        </div >


    )
}