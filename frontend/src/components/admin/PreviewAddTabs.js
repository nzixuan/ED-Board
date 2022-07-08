import React from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import Table from "../board/Table";

export default function PreviewAddTabs(props) {
    return (<TabView scrollable>
        {props.rostersList.map((rosters, rostersIndex) => {
            const header = rosters.rosters[0].staffType.toUpperCase() + " " + rosters.date
            return (<TabPanel header={header} key={header} >
                <div>
                    <Table roster={rosters.rosters[0]}></Table>
                </div>
            </TabPanel>)
        })}

    </TabView>)

}