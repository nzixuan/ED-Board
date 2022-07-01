import React, { useState } from "react";
import { Dropdown } from 'primereact/dropdown';


export default function AssignmentDialog(props) {
    const [state, setState] = useState({ assignment: "", staffType: "", boards: [] })

    if (props.assignment !== undefined)
        setState({ ...state, assignment: props.assignment })
    //API calls for assignment details
    if (props.staffType !== undefined)
        setState({ ...state, staffType: props.staffType })
    //API Calls for boards 

    return <div>
        Hi
    </div>

}

