import React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
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
                < DataTable value={props.roster["roster"]} header={capitalizeFirstLetter(props.roster.staffType)} responsiveLayout="stacked"
                    showGridlines stripedRows rowGroupMode="rowspan" groupRowsBy="assignment">
                    <Column className="font-bold" field="assignment" header="Assignment"></Column>
                    <Column header="AM" body={nameTemplate("am")} ></Column>
                    <Column header="Straddle" body={nameTemplate("straddle1")}></Column>
                    <Column header="PM" body={nameTemplate("pm")}></Column>
                    <Column header="Straddle" body={nameTemplate("straddle2")}></Column>
                    <Column header="ND" body={nameTemplate("nd")}></Column>
                </DataTable>
            }
        </div >


    )
}

/* < DataTable value={this.state.rosters[1]["roster"]} responsiveLayout="scroll" showGridlines stripedRows >
<Column field="assignment" header="Assignment"></Column>
<Column header="AM" body={this.nameTemplate("am")}></Column>
<Column header="PM" body={this.nameTemplate("pm")}></Column>
<Column header="ND" body={this.nameTemplate("nd")}></Column>
</DataTable> */