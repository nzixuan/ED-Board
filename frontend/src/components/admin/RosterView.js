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
    const [displayAddAssignDialog, setDisplayAddAssignDialog] = useState(false);
    const [reorder, setReorder] = useState(false);

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
                console.log(prevLength.current)
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

    const newTypeTabHeaderTemplate = (options) => {
        return (
            <div className="pr-2">
                <Button label="" icon="pi pi-plus" className="add-button " ></Button>
            </div>

        )
    };

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

            console.log(newRosters)
            axios.post(process.env.REACT_APP_API_URL + '/api/edboard/roster/create', newRosters).then((res) => {
                loadRostersList()
            })
        }).catch((err) => {
            //Show err
            console.log(err)
        })
    }

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
                <Button label="New Row" icon="pi pi-plus" className="p-button-success mr-2" />
                {/* onClick={openNew}  */}

                <ToggleButton checked={!reorder} onChange={(e) => setReorder(!e.value)} className=" mr-2"
                    onLabel="Reorder Row " onIcon="pi pi-bars" offLabel="Reorder Done" offIcon="pi pi-bars" />

                <Button label="Delete" icon="pi pi-trash" className="p-button-danger mr-2" />
                {/* onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} */}

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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" />
                {/* onClick={() => confirmDeleteProduct(rowData)} */}
            </React.Fragment>
        );
    }

    const textEditor = (field) => (options) => {
        const staff = options.rowData[field]
        return <InputText type="text" value={staff ? staffToString(staff) : ""} onChange={
            (e) => {
                try {
                    return options.editorCallback(stringToStaff(e.target.value))
                } catch (e) {
                    console.log(e)
                    return
                }
            }
        } />;
    }


    const onCellEditComplete = (e) => {
        let { rowData, newValue, field } = e;

        if (newValue && newValue.name)
            rowData[field] = newValue
        else
            delete rowData[field]
        // event.preventDefault();

        console.log(rostersList)
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

    return (
        <div className="content" >
            <div className="heading-banner">
                <h2 className="heading">
                    Edit Roster                </h2>
                <Button label="Add Roster" className="m-4" onClick={() => setDisplayAddRosterDialog(true)}></Button>
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
                                                showGridlines stripedRows size="medium" onRowReorder={onRowReorder(rostersIndex, rosterindex)} editMode="cell">
                                                {reorder &&
                                                    <Column rowReorder style={{ width: '3em' }} />}
                                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                                                <Column className="assignment-column" field="assignment" header="Assignment" headerClassName="header"></Column>
                                                <Column className="data-column" field="am" header="AM" body={nameTemplate("am")} headerClassName="header"
                                                    editor={(options) => textEditor("am")(options)} onCellEditComplete={onCellEditComplete}></Column>
                                                {roster.staffType === "doctor" &&
                                                    <Column className="data-column" field="straddle1" header="Straddle" body={nameTemplate("straddle1")} headerClassName="header"
                                                        editor={(options) => textEditor("straddle1")(options)} onCellEditComplete={onCellEditComplete}></Column>
                                                }
                                                <Column className="data-column" field="pm" header="PM" body={nameTemplate("pm")} headerClassName="header"
                                                    editor={(options) => textEditor("pm")(options)} onCellEditComplete={onCellEditComplete}></Column>
                                                {roster.staffType === "doctor" &&
                                                    <Column className="data-column" field="straddle2" header="Straddle" body={nameTemplate("straddle2")} headerClassName="header"
                                                        editor={(options) => textEditor("straddle2")(options)} onCellEditComplete={onCellEditComplete}></Column>
                                                }
                                                <Column className="data-column" field="nd" header="ND" body={nameTemplate("nd")} headerClassName="header"
                                                    editor={(options) => textEditor("nd")(options)} onCellEditComplete={onCellEditComplete}></Column>
                                                <Column body={actionBodyTemplate} exportable={false} style={{ width: '4rem' }}></Column>

                                            </DataTable>
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
        </div >
    )
}