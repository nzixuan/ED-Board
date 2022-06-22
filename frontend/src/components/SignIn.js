import * as React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';


export default function SignIn() {
    const message = useRef(null);
    const [state, setState] = useState({ username: '', password: '' })
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
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4 my-6">
                <div className="text-center mb-5">
                    <div className="text-900 text-3xl font-medium mb-3">Log in</div>
                    {/* <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                    <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a> */}
                </div>
                <div>
                    <label htmlFor="username" className="block text-900 font-medium mb-2">Username</label>
                    <InputText id="username" type="text" value={state.username} onChange={(e) => setState({ ...state, username: e.target.value })} className="w-full mb-3" />

                    <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                    <InputText id="password" type="password" value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} className="w-full mb-3" />

                    {/* <div className="flex align-items-center justify-content-between mb-6"> */}
                    <Messages className="w-full mb-3" ref={message}></Messages>

                    {/* <div className="flex align-items-center">
                            <Checkbox id="rememberme" onChange={e => setChecked(e.checked)} checked={checked} className="mr-2" />
                            <label htmlFor="rememberme">Remember me</label>
                        </div> */}
                    {/* <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a> */}
                    {/* </div> */}

                    <Button label="Sign In" icon="pi pi-user" className="w-full" onClick={handleSubmit} />
                </div>
            </div>
        </div>

    );
}