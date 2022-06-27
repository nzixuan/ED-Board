import React from "react";
import { useState, useEffect, useContext } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { UserContext } from "../../context/UserContext";
import { Dialog } from 'primereact/dialog';

import axios from "axios";
import "./RosterView.css"

function nameTemplate(field) {
    return (rowData) => {
        if (rowData.hasOwnProperty(field))
            return rowData[field].name;
        return ""
    }
}



export default function RosterView(props) {
    const [user,] = useContext(UserContext)

    const [rostersList, setRostersList] = useState([]);

    useEffect(() => {
        loadRostersList()
    }, []);

    const deleteRoster = (date) => {
        axios.post(process.env.REACT_APP_API_URL + "/api/edboard/roster/delete", { username: user.username, date: date }).then((res) => {
            loadRostersList()
        })
    }

    const loadRostersList = () => {
        axios.get(process.env.REACT_APP_API_URL + '/api/edboard/roster/later').then((res) => {
            setRostersList(res.data)
            //TODO: if roster list = [] then make new tab 
        }).catch((err) => {
            //TODO: some error thingy
            setRostersList([])
        })
    }

    const newTypeTabHeaderTemplate = (options) => {
        return (
            <div className="pr-2">
                <Button label="" icon="pi pi-plus" className="add-button " ></Button>
            </div>

        )
        // onClick={options.onClick}
    };

    const newRosterTabHeaderTemplate = (options) => {
        return (
            <div className="pr-2">

                <Button label="" icon="pi pi-plus" className="add-button m-2" onClick={() => {
                    axios.get(process.env.REACT_APP_API_URL + '/api/edboard/config/allAssignments').then((res) => {
                        //Guarding
                        if (rostersList === [])
                            return
                        let assignments = res.data
                        for (const property in assignments) {
                            assignments[property] = new Set(assignments[property])
                        }
                        const rosters = rostersList[rostersList.length - 1]
                        let newRosters = {}
                        console.log(rosters)
                        newRosters.username = user.username
                        const date = new Date(rosters.date)
                        date.setDate(date.getDate() + 1)
                        newRosters.date = date
                        newRosters.rosters = rosters.rosters.map((roster) => {
                            return {
                                staffType: roster.staffType, roster: roster.roster.filter((staff) => {
                                    return assignments[roster.staffType] && assignments[roster.staffType].has(staff.assignment)
                                }).map((staff) => {
                                    return { assignment: staff.assignment }
                                })
                            }
                        })

                        console.log(newRosters)
                        axios.post(process.env.REACT_APP_API_URL + '/api/edboard/roster/create', newRosters).then((res) => loadRostersList())
                    }).catch((err) => {
                        //Show err
                        console.log(err)
                    })
                }
                }></Button>
            </div>
        )
    }


    const formatDate = (date) => {
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const d = new Date(date)
        return d.toLocaleDateString('en-GB') + ",\n" + weekday[d.getDay()]
    }


    return (


        <div className="content" >
            <div className="heading-banner">
                <h2 className="heading">
                    Edit Roster                </h2>
                <Button label="Add Roster" className="m-4" ></Button>
            </div>
            <div className="card">
                <TabView className="w-full" scrollable>
                    {rostersList.length > 0 && rostersList.map((rosters, rostersIndex) => {
                        return <TabPanel header={formatDate(rosters.date)} key={rosters.date} headerClassName="text-xl">
                            <TabView className="w-full" scrollable>
                                {rosters.rosters.length > 0 && rosters.rosters.map((roster, rosterindex) => {

                                    const onRowReorder = (e) => {
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
                                        setRostersList(newRostersList);
                                    }

                                    return (
                                        <TabPanel header={roster.staffType.toUpperCase()} key={rosterindex}>
                                            <Button label="Add Assignment" className="m-4" ></Button>
                                            <Button label="Delete Roster" className="m-4" onClick={() => {
                                                deleteRoster(rosters.date)
                                            }} ></Button>
                                            < DataTable className="h-full" value={roster.roster} responsiveLayout="scroll"
                                                showGridlines stripedRows size="medium" onRowReorder={onRowReorder}>
                                                <Column rowReorder style={{ width: '3em' }} />
                                                <Column className="assignment-column" field="assignment" header="Assignment" headerClassName="header"></Column>
                                                <Column className="data-column" header="AM" body={nameTemplate("am")} headerClassName="header"></Column>
                                                {roster.staffType === "doctor" &&
                                                    <Column className="data-column" header="Straddle" body={nameTemplate("straddle1")} headerClassName="header"></Column>
                                                }
                                                <Column className="data-column" header="PM" body={nameTemplate("pm")} headerClassName="header"></Column>
                                                {roster.staffType === "doctor" &&
                                                    <Column className="data-column" header="Straddle" body={nameTemplate("straddle2")} headerClassName="header"></Column>
                                                }
                                                <Column className="data-column" header="ND" body={nameTemplate("nd")} headerClassName="header"></Column>
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
