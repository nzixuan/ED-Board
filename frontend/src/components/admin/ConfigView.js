import React, { useContext } from "react";
import { useState, useEffect, useRef } from 'react';
import { UserContext } from "../../context/UserContext";
import { Button } from 'primereact/button';
import axios from "axios";
import { Messages } from 'primereact/messages';
import { Checkbox } from 'primereact/checkbox';
import { TabPanel, TabView } from "primereact/tabview";
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import "./ConfigView.css"


function ConfigView() {
    const toast = useRef(null);

    const [config, setConfig] = useState({ boards: {}, boardNames: {} });
    const [addDialog, setAddDialog] = useState(false)
    const [type, setType] = useState([]);
    const [addAssignmentState, setAddAssignmentState] = useState({ assignment: "", boards: [] });

    const [user,] = useContext(UserContext)

    const message = useRef(null);
    const dialogMessage = useRef(null);


    useEffect(() => {
        loadData()

    }, []);

    const loadData = () => {
        axios.get(process.env.REACT_APP_API_URL + '/api/edboard/config').then((res) => {
            setConfig({ boards: res.data.boards, boardNames: res.data.boardNames })

        }).catch((err) => {
            setConfig({})

        })
        axios.get(process.env.REACT_APP_API_URL + '/api/edboard/config/allAssignments').then((res) => {

            if (res.data) {
                setType(res.data)
            }

        }).catch((err) => {
            setType([])

        })
    }

    const handleSubmit = (newConfig) => {

        try {
            let boards = config.boards
            let boardNames = config.boardNames
            if (newConfig !== undefined) {
                boards = newConfig.boards
                boardNames = newConfig.boardNames
            }
            axios.post(process.env.REACT_APP_API_URL + '/api/edboard/config',
                { username: user.username, boards: boards, boardNames: boardNames }).then((res) => {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Config Saved', life: 3000 });
                    loadData()
                }).catch((err) => {
                    if (err.response.data) {
                        message.current.show({ severity: 'error', summary: '', detail: err.response.data.message });
                    } else {
                        message.current.show({ severity: 'error', summary: '', detail: "Server Error" });
                    }
                })
        } catch (err) {
            console.log(err)
            message.current.show({ severity: 'error', summary: '', detail: err.message });
        }

    }

    const handleCheckBoxClick = (board, staffType, assignment) => (e) => {
        let newConfig = config
        const checked = config.boards[board][staffType].includes(assignment)
        let array = []
        type[staffType].forEach(assign => {

            if ((config.boards[board][staffType].includes(assign) && !(assign === assignment && checked))
                || (!checked && assign === assignment)) {
                array.push(assign)
            }

        });

        newConfig.boards[board][staffType] = array
        setConfig({ ...newConfig })

    }


    return (

        <div>
            <Toast ref={toast} />

            <h2 className="heading">
                Assignment Config
            </h2>
            <div className="content" >
                <div className="card">
                    <TabView>
                        {Object.keys(type).length > 0 &&
                            Object.keys(type).map((t) =>
                                <TabPanel header={t.toUpperCase()} key={t}>
                                    {type[t].length > 0 &&
                                        <div className="flex flex-column" >
                                            <div className="top-labels sticky top-0 pl-4 pr-4 pt-0 pb-1">
                                                <div className="flex flex-grow-1">

                                                    <h3 className="assignment-label">{"Assignments"}</h3>
                                                    {
                                                        Object.keys(config.boards).length > 0 && Object.keys(config.boards).map((board) => {
                                                            return (<h3 className="board-label" key={board}>{board}</h3>)
                                                        })
                                                    }
                                                </div>
                                                <Button label="Add Assignment" className="p-button-raised p-button-help" onClick={() => setAddDialog(true)}></Button>
                                            </div>
                                            {type[t].map((assignment) => {
                                                return (
                                                    <div key={assignment}>
                                                        <div className="flex align-items-center pl-4 pr-4 pt-4">
                                                            <h3 className="assignment-label">{assignment}</h3>
                                                            {
                                                                Object.keys(config.boards).length > 0 && Object.keys(config.boards).map((board) => {
                                                                    if (config.boards[board][t])
                                                                        return (<div className="checkbox-container" key={board}>
                                                                            <Checkbox className="checkbox"
                                                                                checked={config.boards[board][t].includes(assignment)} onChange={handleCheckBoxClick(board, t, assignment)} ></Checkbox>

                                                                        </div>)
                                                                    return null
                                                                })
                                                            }
                                                        </div>
                                                        <Divider></Divider>
                                                    </div>)


                                            }
                                            )}
                                        </div>

                                    }

                                    <Dialog visible={addDialog} header="Add Assignment" contentClassName="border-round-bottom" onHide={() => setAddDialog(false)} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }}>
                                        <div className="field">
                                            <label htmlFor="assignment" className="block"> Assignment</label>

                                            <InputText id="assignment" value={addAssignmentState.assignment}
                                                onChange={(e) => setAddAssignmentState({ ...addAssignmentState, assignment: e.target.value })} />
                                        </div>
                                        <div className="flex flex-wrap">
                                            {Object.keys(config.boards).length > 0 && Object.keys(config.boards).map((board) => {
                                                return (
                                                    <div className="w-3" key={board}>
                                                        <h3>{board}</h3>
                                                        <Checkbox checked={addAssignmentState.boards.includes(board)} onChange={(e) => {
                                                            let selectedBoards = [...addAssignmentState.boards];
                                                            if (e.checked)
                                                                selectedBoards.push(board)
                                                            else
                                                                selectedBoards.splice(selectedBoards.indexOf(board), 1);
                                                            setAddAssignmentState({ ...addAssignmentState, boards: selectedBoards })
                                                        }}></Checkbox> </div>)
                                            })}
                                        </div>
                                        <Messages className="w-full mb-3" ref={dialogMessage}></Messages>

                                        <Button label="Submit" className="pt-2 mt-4" onClick={() => {
                                            const boards = config.boards
                                            if (addAssignmentState.assignment === "") {
                                                dialogMessage.current.show({ severity: 'error', summary: '', detail: "Assignment cannot be empty" });

                                            } else if (type[t].includes(addAssignmentState.assignment)) {
                                                dialogMessage.current.show({ severity: 'error', summary: '', detail: "Assignment is already added" });

                                            } else if (addAssignmentState.boards.length === 0) {
                                                dialogMessage.current.show({ severity: 'error', summary: '', detail: "No boards chosen" });

                                            }
                                            else {
                                                addAssignmentState.boards.forEach((board) => {
                                                    boards[board][t].push(addAssignmentState.assignment)
                                                })
                                                handleSubmit({ ...config, boards: boards })
                                                setAddDialog(false)
                                            }
                                        }
                                        }></Button>

                                    </Dialog>
                                </TabPanel>
                            )


                        }
                    </TabView>
                    <Messages className="w-full mb-3" ref={message}></Messages>


                </div>
                <Button label="Save" className="p-button-rounded p-button-success save-button p-button-lg shadow-2" icon="pi pi-save" onClick={() => handleSubmit()} />
            </div >

        </div >


    )
}



export default ConfigView;