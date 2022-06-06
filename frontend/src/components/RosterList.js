import React from "react";
import { Button } from 'primereact/button';

export default function RosterList(props) {
    return (
        <div>
            <p>{JSON.stringify(props.roster)}</p>
        </div>
    )
}