import React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from "react-router-dom";

import './Table.css'

function nameTemplate(field) {
    return (rowData) => {
        if (rowData.hasOwnProperty(field))
            return rowData[field].name;
        return ""
    }
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Table(props) {

    return (
        <div className="p-2">
            {
                props.roster &&
                < DataTable value={props.roster["roster"]} header={(props.roster.staffType).toUpperCase()} responsiveLayout="scroll"
                    showGridlines stripedRows rowGroupMode="rowspan" groupRowsBy="assignment" size="small">
                    <Column className="py-2 px-1 font-bold " field="assignment" header="Assignment" ></Column>
                    <Column className="py-1 px-1" header="AM" body={nameTemplate("am")} ></Column>
                    {props.roster.staffType === "doctor" &&
                        <Column className="py-1 px-1" header="Straddle" body={nameTemplate("straddle1")}></Column>
                    }
                    <Column className="py-1 px-1" header="PM" body={nameTemplate("pm")}></Column>
                    {props.roster.staffType === "doctor" &&
                        <Column className="py-1 px-1" header="Straddle" body={nameTemplate("straddle2")}></Column>
                    }
                    <Column className="py-1 px-1" header="ND" body={nameTemplate("nd")}></Column>
                </DataTable>
            }
        </div >


    )
}