import * as React from 'react';
import { useState, useRef, useContext } from 'react';
import axios from 'axios'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { Password } from 'primereact/password';
import { UserContext } from "../../context/UserContext";



export default function ChangePasswordDialog(props) {
    const [user,] = useContext(UserContext)
    const message = useRef(null);
    const [state, setState] = useState({ opassword: '', password: '', cpassword: '' })
    const [valid, setValid] = useState([true, true, true])

    const handleSubmit = async () => {

        if (await fieldsValid()) {
            const token = localStorage.getItem('token');

            axios.post(process.env.REACT_APP_API_URL + '/api/edboard/user/password',
                { username: props.self ? user.username : props.user.username, password: state.password }, { headers: { token: token } }).then((res) => {
                    props.toast.current.show({ severity: 'info', summary: 'Success!', detail: 'Password has been changed', life: 3000 });
                    props.setChangePassword(false)
                }).catch((err) => {
                    console.log(err)
                    if (err.response.data) {
                        message.current.show({ severity: 'error', summary: '', detail: err.response.data.message });
                    } else {
                        message.current.show({ severity: 'error', summary: '', detail: "Server Error" });
                    }

                })
        }
    };

    const passwordValid = (password) => {
        const re = new RegExp("^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9#$@!%&*?.]{8,20}$");
        return re.test(password);
    }

    const fieldsValid = async () => {
        const fieldsValid = [await oldPasswordValid(state.opassword), passwordValid(state.password), state.password === state.cpassword]
        setValid(fieldsValid)
        console.log(fieldsValid)
        if (fieldsValid[0] && fieldsValid[1] && fieldsValid[2]) {
            return true
        }
        return false
    }

    const oldPasswordValid = async (password) => {
        if (!props.self)
            return true

        const data = await axios.post(process.env.REACT_APP_API_URL + '/api/edboard/user/login',
            { username: props.self ? user.username : props.user.username, password: password }).then((res) => {
                return true
            }).catch((err) => {
                console.log(err)
                return false
            })
        return data
    }

    return (

        <div>
            <div className="field">
                <label htmlFor="username" className="block text-900 font-medium mb-2">Username</label>
                <InputText className="w-full" id="username" type="text" value={props.self ? user.username : props.user.username} disabled />
            </div>

            {props.self && <div className="field">
                <label htmlFor="password" className="block text-900 font-medium mb-2">Current Password</label>
                <Password className={"w-full" + (valid[0] ? "" : " p-invalid")} feedback={false} inputClassName="w-full" id="password" toggleMask value={state.opassword} onChange={(e) => setState({ ...state, opassword: e.target.value })} />
                {!valid[0] && <div className='flex align-items-center pt-2'>
                    <i className="p-error pi pi-info-circle"></i><small id="opassword-help" className="pl-2 p-error">Invalid Current Password</small>
                </div>}
            </div>}
            <div className="field">
                <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                <Password className={"w-full" + (valid[1] ? "" : " p-invalid")} feedback={false} inputClassName="w-full" id="password" toggleMask value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} />
                {!valid[1] && <div className='flex align-items-center pt-2'>
                    <i className="p-error pi pi-info-circle"></i><small id="password-help" className="pl-2 p-error">8 - 20 characters, at least one letter and one number</small>
                </div>}
            </div>
            <div className="field">
                <label htmlFor="cpassword" className="block text-900 font-medium mb-2">Confirm Password</label>
                <Password className={"w-full" + (valid[2] ? "" : " p-invalid")} feedback={false} inputClassName="w-full" id="cpassword" toggleMask value={state.cpassword} onChange={(e) => setState({ ...state, cpassword: e.target.value })} />
                {!valid[2] && <div className='flex align-items-center pt-2'>
                    <i className="p-error pi pi-info-circle"></i><small id="cpassword-help" className="pl-2 p-error">Password does not match</small>
                </div>}
            </div>
            <Messages className="w-full mb-3" ref={message}></Messages>
            <Button label="Confirm Change" icon="pi pi-tick" className="w-full" onClick={handleSubmit} />

        </div>
    );
}