import React from "react";

export default function RosterList(props) {
    return (
        <div>
            <p>{JSON.stringify(props.roster)}</p>
        </div>
    )
}