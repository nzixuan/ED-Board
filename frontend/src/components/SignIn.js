import * as React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';
import RegisterDialog from './RegisterDialog';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';


export default function SignIn() {
    const message = useRef(null);
    const toast = useRef(null);

    const [state, setState] = useState({ username: '', password: '' })
    const [displayRegister, setDisplayRegister] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = () => {
        axios.post(process.env.REACT_APP_API_URL + '/api/edboard/user/login',
            { username: state.username, password: state.password }).then((res) => {
                localStorage.setItem('token', res.data.token)
                navigate("/admin")
            }).catch((err) => {
                console.log(err)
                if (err.response.data) {
                    message.current.show({ severity: 'error', summary: '', detail: err.response.data.message });
                } else {
                    message.current.show({ severity: 'error', summary: '', detail: "Server Error" });
                }
                setState({ username: '', password: '' })
            })
    };

    return (

        <div className="flex align-items-center justify-content-center ">
            <Toast ref={toast} />
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-3 md:w-6 my-6">
                <div className="text-center mb-5">
                    <div className="text-900 text-3xl font-medium mb-3">Log in</div>
                </div>
                <div>
                    <label htmlFor="username" className="block text-900 font-medium mb-2">Username</label>
                    <InputText id="username" type="text" value={state.username} onChange={(e) => setState({ ...state, username: e.target.value })} className="w-full mb-3" />

                    <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                    <Password feedback={false} inputClassName="w-full" id="password" toggleMask value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} className="w-full mb-3" />
                    <Messages className="w-full mb-3" ref={message}></Messages>
                    <Button label="Sign In" icon="pi pi-user" className="w-full" onClick={handleSubmit} />
                    <div className='flex justify-content-between'>
                        <Button className="p-button p-button-text p-2 mt-4" label="Register" onClick={() => { setDisplayRegister(true) }}></Button>
                        <Button className="p-button p-button-text p-button-help p-2 mt-4" label="Go to Boards" onClick={() => { navigate("/") }}></Button>
                    </div>
                </div>
                <Dialog visible={displayRegister} className="w-full lg:w-3 md:w-6" contentClassName='border-round-bottom' header={"Register"}
                    resizable={false} blockScroll draggable={false} onHide={() => setDisplayRegister(false)}>
                    <RegisterDialog setDisplayRegister={setDisplayRegister} toast={toast}></RegisterDialog>
                </Dialog>
            </div>
        </div>

    );
}