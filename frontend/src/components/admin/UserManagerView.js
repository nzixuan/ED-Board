import React from "react";
import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';

import RegisterDialog from './RegisterDialog';

import axios from "axios";
import ChangePasswordDialog from "./ChangePasswordDialog";

export default function UserManagerView(props) {

    const [users, setUsers] = useState([]);
    const [selectedUser, setselectedUser] = useState(null);
    const [displayRegister, setDisplayRegister] = useState(false)
    const [changePassword, setChangePassword] = useState(false)

    const toast = useRef(null);
    const deleteUser = useRef(null);

    const loadData = () => {
        const token = localStorage.getItem('token');

        axios.get(process.env.REACT_APP_API_URL + '/api/edboard/user', { headers: { token: token } }).then((res) => {
            setUsers(res.data.users)
        }).catch((err) => {

        })
    }


    useEffect(() => {
        loadData()
    }, []);
    useEffect(() => {
        loadData()
    }, [displayRegister]);

    const toolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Create User" icon="pi pi-plus" className="p-button-success mr-2" onClick={() => { setDisplayRegister(true) }} />
                <Button label="Change Password" icon="pi pi-pencil" className="p-button-warning mr-2" disabled={!selectedUser}
                    onClick={() => { setChangePassword(true) }} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger mr-2" disabled={!selectedUser}
                    onClick={(e) => { deleteUser.current.toggle(e) }} />
            </React.Fragment>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <h2 className="heading">
                User Manager
            </h2>
            <div className="content" >
                {
                    users ?
                        <div className="card">
                            <Toolbar className="mb-4" left={toolbarTemplate} ></Toolbar>
                            < DataTable className="h-full" value={users} responsiveLayout="scroll"
                                showGridlines stripedRows size="small" paginator rows={10} selection={selectedUser} onSelectionChange={e => setselectedUser(e.value)} dataKey="_id" >
                                <Column selectionMode="single" headerStyle={{ width: '3em' }}></Column>
                                <Column field="username" header="Username" headerClassName="header"></Column>
                                <Column field="role" header="Role" headerClassName="header"></Column>
                                <Column field="_id" header="ID" headerClassName="header"></Column>
                            </DataTable>
                        </div> :
                        <h3 className="pl-4"> No Users Found</h3>
                }
            </div >
            <Dialog visible={displayRegister} className="w-full lg:w-3 md:w-6" contentClassName='border-round-bottom' header={"Create User"}
                resizable={false} blockScroll draggable={false} onHide={() => setDisplayRegister(false)}>
                <RegisterDialog setDisplayRegister={setDisplayRegister} toast={toast} ></RegisterDialog>
            </Dialog>

            <OverlayPanel dismissable ref={deleteUser} showCloseIcon >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {selectedUser && <span>Are you sure you want to delete {selectedUser.username}?</span>}
                    <div className="flex justify-content-end pt-2">
                        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => deleteUser.current.hide()} />
                        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={() => {
                            const token = localStorage.getItem('token');
                            axios.post(process.env.REACT_APP_API_URL + '/api/edboard/user/delete',
                                { username: selectedUser.username }, { headers: { token: token } }).then((res) => {
                                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Row Deleted', life: 3000 });
                                    loadData()
                                    deleteUser.current.hide()
                                }).catch((err) => {
                                    console.log(err)
                                    if (err.response.data) {
                                        toast.current.show({ severity: 'error', summary: '', detail: err.response.data.message });
                                    } else {
                                        toast.current.show({ severity: 'error', summary: '', detail: "Server Error" });
                                    }
                                })

                        }} />
                    </div>
                </div>
            </OverlayPanel>
            <Dialog visible={changePassword} className="w-full lg:w-3 md:w-6" contentClassName='border-round-bottom' header={"Change Password"}
                resizable={false} blockScroll draggable={false} onHide={() => setChangePassword(false)}>
                <ChangePasswordDialog user={selectedUser} setChangePassword={setChangePassword} toast={toast} self={false}></ChangePasswordDialog>
            </Dialog>

        </div>

    )
}