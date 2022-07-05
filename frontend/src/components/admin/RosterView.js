import React from "react";
import { useState, useEffect, useContext, useRef } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { UserContext } from "../../context/UserContext";
import { ConfirmPopup } from 'primereact/confirmpopup'; // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup'; // To use confirmPopup method
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import AssignmentDialog from "./AssignmentDialog";
import { Toolbar } from 'primereact/toolbar';
import { ToggleButton } from 'primereact/togglebutton';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

import axios from "axios";
import "./RosterView.css"
import CreateRoster from "./CreateRoster";

function nameTemplate(field) {
    return (rowData) => {
        if (rowData.hasOwnProperty(field))
            return staffToString(rowData[field]);
        return ""
    }
}

const staffToString = (staff) => {
    return staff.name
}

const stringToStaff = (string) => {
    return { name: string }
}



const formatDate = (date) => {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date(date)
    return d.toLocaleDateString('en-GB') + ",\n" + weekday[d.getDay()]
}

export default function RosterView(props) {
    const [user,] = useContext(UserContext)
    const [displayAddRosterDialog, setDisplayAddRosterDialog] = useState(false);
    const [row, setRow] = useState(null);
    const [reorder, setReorder] = useState(false);
    const [selectedRows, setSelectedRows] = useState(null);
    const [deleteRowDialog, setDeleteRowDialog] = useState(false);
    const [deleteRowsDialog, setDeleteRowsDialog] = useState(false);
    const [addRowDialog, setAddRowDialog] = useState(false);
    const [type, setType] = useState([]);

    const toast = useRef(null);

    const [rostersList, setRostersList] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const prevLength = useRef(null);

    useEffect(() => {
        loadRostersList()
    }, []);

    useEffect(() => {
        if (activeIndex >= rostersList.length && activeIndex > 0)
            setActiveIndex(rostersList.length - 1)

    }, [rostersList]);


    useEffect(() => {
        if (displayAddRosterDialog === false)
            loadRostersList()
    }, [displayAddRosterDialog]);

    const deleteRoster = (date) => {
        axios.post(process.env.REACT_APP_API_URL + "/api/edboard/roster/delete", { username: user.username, date: date }).then((res) => {
            loadRostersList()
        })
    }

    const loadRostersList = () => {
        axios.get(process.env.REACT_APP_API_URL + '/api/edboard/roster/later').then((res) => {
            if (res.data < 1) {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                createNewRoster(today)

            }
            else {
                setRostersList(res.data)
                if (res.data.length > prevLength.current)
                    setActiveIndex(res.data.length)
                else
                    setActiveIndex(activeIndex)
                prevLength.current = res.data.length
            }
        }).catch((err) => {
            //TODO: some error thingy
            setRostersList([])
        })
        axios.get(process.env.REACT_APP_API_URL + '/api/edboard/config/allAssignments').then((res) => {

            if (res.data) {
                setType(res.data)
            }

        }).catch((err) => {
            setType([])

        })

    }

    function saveRosterList(list) {
        if (!list)
            list = rostersList

        let newRostersList = []
        for (let i = 0; i < list.length; i++) {
            newRostersList.push(...list[i].rosters.map((roster) => { return { date: list[i].date, rosters: [roster] } }))
        }
        axios.post(process.env.REACT_APP_API_URL + "/api/edboard/roster/massCreate", { username: user.username, rosters: newRostersList }).then((res) => {
            loadRostersList()
        })
    }

    const createNewRoster = (date) => {
        axios.get(process.env.REACT_APP_API_URL + '/api/edboard/config/allAssignments').then((res) => {

            const assignments = res.data
            let assignmentSet = {};
            for (const property in assignments) {
                assignmentSet[property] = new Set(assignments[property])
            }

            let newRosters = {}
            newRosters.username = user.username
            if (date === undefined && rostersList.length > 0) {
                const rosters = rostersList[rostersList.length - 1]
                const newDate = new Date(rosters.date)
                newDate.setDate(newDate.getDate() + 1)
                newRosters.date = newDate
                newRosters.rosters = rosters.rosters.map((roster) => {
                    return {
                        staffType: roster.staffType, roster: roster.roster.filter((staff) => {
                            return assignmentSet[roster.staffType] && assignmentSet[roster.staffType].has(staff.assignment)
                        }).map((staff) => {
                            return { assignment: staff.assignment }
                        })
                    }
                })

                const newRostersType = new Set(newRosters.rosters.map((roster) => roster.staffType))
                for (const property in assignments) {
                    if (!newRostersType.has(property)) {
                        newRosters.rosters.push({
                            staffType: property, roster: assignments[property].map((assignment) => {
                                return { assignment: assignment }
                            })
                        })
                    }
                }
            } else {
                if (!date) {
                    var today = new Date()
                    today.setHours(0, 0, 0, 0)
                    newRosters.date = today
                }
                else
                    newRosters.date = date
                newRosters.rosters = []
                for (const property in assignments) {
                    newRosters.rosters.push({
                        staffType: property, roster: assignments[property].map((assignment) => {
                            return { assignment: assignment }
                        })
                    })
                }

            }

            axios.post(process.env.REACT_APP_API_URL + '/api/edboard/roster/create', newRosters).then((res) => {
                loadRostersList()
            })
        }).catch((err) => {
            //Show err
            console.log(err)
        })
    }

    const newTypeTabHeaderTemplate = (options) => {
        return (
            <div className="pr-2">
                <Button label="" icon="pi pi-plus" className="add-button " ></Button>
            </div>

        )
    };

    const newRosterTabHeaderTemplate = (options) => {
        return (
            <div className="new-tab">
                <Button label="" icon="pi pi-plus" className="add-button m-2" onClick={() => createNewRoster()
                }></Button>
            </div>
        )
    }

    const dateHeaderTemplate = (date) => {
        return (options) => {
            return (<div onClick={options.onClick} className="date-tabs">
                <h4 className="date-label">{formatDate(date)}</h4>
                <Button icon="pi pi-times" className="delete-button" onClick={
                    (event) => {
                        confirmPopup({
                            target: event.currentTarget,
                            message: 'Are you sure you want to proceed? \n This action will delete all rosters for the date.',
                            icon: 'pi pi-exclamation-triangle',
                            accept: () => deleteRoster(date),

                        });
                    }} ></Button>
                <ConfirmPopup /></div>)
        }
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New Row" icon="pi pi-plus" className="p-button-success mr-2" onClick={() => setAddRowDialog(true)} />

                <ToggleButton checked={!reorder} onChange={(e) => setReorder(!e.value)} className=" mr-2"
                    onLabel="Reorder Row " onIcon="pi pi-bars" offLabel="Reorder Done" offIcon="pi pi-bars" />

                <Button label="Delete" icon="pi pi-trash" className="p-button-danger mr-2" disabled={!selectedRows || !selectedRows.length} onClick={() => setDeleteRowsDialog(true)} />


            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" />
                {/* onClick={exportCSV} */}
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => {
                    setRow(rowData)
                    setDeleteRowDialog(true)
                }} />

            </React.Fragment>
        );
    }

    const textEditor = (field, rostersIndex, rosterindex) => (options) => {
        const staff = options.rowData[field]
        return (<div className="flex align-items-center justify-content-between w-full">
            <InputText className="w-10" type="text" value={staff ? staffToString(staff) : ""} onChange={
                (e) => {
                    try {
                        return options.editorCallback(stringToStaff(e.target.value))
                    } catch (e) {
                        console.log(e)
                        return
                    }
                }
            } />    <Button icon="pi pi-plus" className="add-button " onClick={() => {
                let newRostersList = rostersList;
                let roster = newRostersList[rostersIndex].rosters[rosterindex].roster
                roster.splice(options.rowIndex + 1, 0, { assignment: options.rowData.assignment })
                saveRosterList(newRostersList)

            }}></Button></div>);
    }

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field } = e;

        if (newValue && newValue.name)
            rowData[field] = newValue
        else
            delete rowData[field]
        // event.preventDefault();

        saveRosterList()
    }

    const onRowReorder = (rostersIndex, rosterindex) => (e) => {
        let newRostersList = rostersList.map((newRosters, newRostersIndex) => {
            if (newRostersIndex !== rostersIndex)
                return newRosters
            return {
                date: newRosters.date, rosters: newRosters.rosters.map((newRoster, newRosterIndex) => {
                    if (newRosterIndex !== rosterindex)
                        return newRoster
                    return { staffType: newRoster.staffType, roster: e.value }
                }
                )
            }
        })

        saveRosterList(newRostersList)
        setRostersList(newRostersList);

    }

    const deleteRowDialogFooter = (rostersIndex, rosterindex) => (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteRowDialog(false)} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={() => {
                let newRostersList = rostersList;
                let roster = newRostersList[rostersIndex].rosters[rosterindex].roster
                roster = roster.filter((val) => { return val !== row })
                newRostersList[rostersIndex].rosters[rosterindex].roster = roster
                saveRosterList(newRostersList)

                setDeleteRowDialog(false);
                setRow(null);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            }} />
        </React.Fragment>
    );

    const deleteRowsDialogFooter = (rostersIndex, rosterindex) => {
        return (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteRowsDialog(false)} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={() => {

                    let newRostersList = rostersList;
                    let roster = newRostersList[rostersIndex].rosters[rosterindex].roster
                    roster = roster.filter((val) => { return !selectedRows.includes(val) })
                    newRostersList[rostersIndex].rosters[rosterindex].roster = roster
                    saveRosterList(newRostersList)

                    setDeleteRowsDialog(false);
                    setSelectedRows(null);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Rows Deleted', life: 3000 });
                }} />
            </React.Fragment>
        )
    };

    const AddRowDialogBody = (props) => {
        const [addRowState, setAddRowState] = useState({ assignment: "" });
        const staffType = rostersList[props.rostersIndex].rosters[props.rosterindex].staffType;
        const options = type[staffType].map((val) => { return { label: val, value: val } })
        console.log(type[staffType])
        return (<div>
            <div className="field">
                <label htmlFor="assignment" className="block"> Assignment</label>

                <Dropdown id="assignment" className="w-8" editable value={addRowState.assignment} options={options}
                    filter showClear filterBy="label" onChange={(e) => setAddRowState({ ...addRowState, assignment: e.target.value })}
                    optionLabel="label" scrollHeight="300px" />
                {/* <InputText id="assignment" value={addRowState.assignment} onChange={(e) => setAddRowState({ ...addRowState, assignment: e.target.value })} /> */}
            </div>
            <div className="flex justify-content-end">
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setAddRowDialog(false)} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={() => {
                    if (!addRowState || addRowState.assignment === "") {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Assignment cannot be empty', life: 3000 });
                        return
                    }


                    let newRostersList = rostersList;
                    newRostersList[props.rostersIndex].rosters[props.rosterindex].roster.push({ assignment: addRowState.assignment })
                    saveRosterList(newRostersList)

                    setAddRowDialog(false);
                    setAddRowState({ assignment: "" });
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Row Added', life: 3000 });
                }} />
            </div>
        </div>)
    }

    return (
        <div className="content" >
            <div className="heading-banner">
                <h2 className="heading">
                    Edit Roster                </h2>
                <Button label="Add From Excel" className="m-4" onClick={() => setDisplayAddRosterDialog(true)}></Button>
                <Dialog visible={displayAddRosterDialog} headerClassName="p-1" contentClassName="border-round-bottom" onHide={() => {
                    setDisplayAddRosterDialog(false)
                }} showHeader maximizable blockScroll style={{ width: '95vw', height: '100vh' }} >
                    <CreateRoster setDisplayDialog={setDisplayAddRosterDialog}></CreateRoster>
                </Dialog>
            </div>
            <div className="card">
                <TabView className="w-full" scrollable activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    {rostersList.length > 0 && rostersList.map((rosters, rostersIndex) => {
                        return <TabPanel headerTemplate={dateHeaderTemplate(rosters.date)} key={rosters.date} headerClassName="text-xl">

                            <TabView className="w-full" scrollable>

                                {rosters.rosters.length > 0 && rosters.rosters.map((roster, rosterindex) => {

                                    return (
                                        <TabPanel header={roster.staffType.toUpperCase()} key={rosterindex}>
                                            {/* <Button label="Add Assignment" className="m-4" onClick={() => setDisplayAddAssignDialog(true)}></Button>
                                            <Dialog visible={displayAddAssignDialog} header="Assignment" headerClassName="p-4 pl-4 pt-3" contentClassName="border-round-bottom" onHide={() => {
                                                setDisplayAddAssignDialog(false)
                                            }} showHeader blockScroll style={{ width: '40vw', height: '80vh' }} >
                                                <AssignmentDialog></AssignmentDialog>
                                            </Dialog> */}
                                            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                                            < DataTable className="h-full" value={roster.roster} responsiveLayout="scroll"
                                                showGridlines stripedRows size="medium" onRowReorder={onRowReorder(rostersIndex, rosterindex)}
                                                selection={selectedRows} selectionMode="checkbox" onSelectionChange={(e) => {
                                                    setSelectedRows(e.value)
                                                }} editMode="cell">
                                                {reorder &&
                                                    <Column rowReorder style={{ width: '3em' }} />}
                                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                                                <Column className="assignment-column" field="assignment" header="Assignment" headerClassName="header"></Column>
                                                <Column className="data-column" field="am" header="AM" body={nameTemplate("am")} headerClassName="header"
                                                    editor={(options) => textEditor("am", rostersIndex, rosterindex)(options)} onCellEditComplete={onCellEditComplete}></Column>
                                                {roster.staffType === "doctor" &&
                                                    <Column className="data-column" field="straddle1" header="Straddle" body={nameTemplate("straddle1")} headerClassName="header"
                                                        editor={(options) => textEditor("straddle1", rostersIndex, rosterindex)(options)} onCellEditComplete={onCellEditComplete}></Column>
                                                }
                                                <Column className="data-column" field="pm" header="PM" body={nameTemplate("pm")} headerClassName="header"
                                                    editor={(options) => textEditor("pm", rostersIndex, rosterindex)(options)} onCellEditComplete={onCellEditComplete}></Column>
                                                {roster.staffType === "doctor" &&
                                                    <Column className="data-column" field="straddle2" header="Straddle" body={nameTemplate("straddle2")} headerClassName="header"
                                                        editor={(options) => textEditor("straddle2", rostersIndex, rosterindex)(options)} onCellEditComplete={onCellEditComplete}></Column>
                                                }
                                                <Column className="data-column" field="nd" header="ND" body={nameTemplate("nd")} headerClassName="header"
                                                    editor={(options) => textEditor("nd", rostersIndex, rosterindex)(options)} onCellEditComplete={onCellEditComplete}></Column>
                                                <Column body={actionBodyTemplate} exportable={false} style={{ width: '4rem' }}></Column>

                                            </DataTable>

                                            <Dialog visible={deleteRowDialog} blockScroll style={{ width: '450px' }} header="Confirm" modal footer={deleteRowDialogFooter(rostersIndex, rosterindex)} onHide={() => setDeleteRowDialog(false)}>
                                                <div className="confirmation-content">
                                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                                    {row && <span>Are you sure you want to delete this row?</span>}
                                                </div>
                                            </Dialog>

                                            <Dialog visible={deleteRowsDialog} blockScroll style={{ width: '450px' }} header="Confirm" modal footer={deleteRowsDialogFooter(rostersIndex, rosterindex)} onHide={() => setDeleteRowsDialog(false)}>
                                                <div className="confirmation-content">
                                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                                    {selectedRows && <span>Are you sure you want to delete the selected rows?</span>}
                                                </div>
                                            </Dialog>

                                            <Dialog visible={addRowDialog} blockScroll style={{ width: '450px' }} header="New Row" contentClassName="border-round-bottom" onHide={() => setAddRowDialog(false)}>
                                                <AddRowDialogBody rostersIndex={rostersIndex} rosterindex={rosterindex}></AddRowDialogBody>
                                            </Dialog>
                                        </TabPanel>

                                    )
                                })
                                }
                                <TabPanel headerTemplate={newTypeTabHeaderTemplate} headerClassName="flex align-items-center"></TabPanel>

                            </TabView>

                        </TabPanel>
                    })}
                    <TabPanel headerTemplate={newRosterTabHeaderTemplate} headerClassName="flex align-items-center"></TabPanel>

                </TabView>
            </div>
            <Toast ref={toast} />
        </div >
    )
}