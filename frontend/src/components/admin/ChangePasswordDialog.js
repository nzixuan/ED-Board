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
    const [state, setState] = useState({ password: '' })
    const [valid, setValid] = useState(true)

    const handleSubmit = () => {

        if (fieldsValid()) {
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

    const fieldsValid = () => {
        const fieldsValid = passwordValid(state.password)
        setValid(fieldsValid)

        if (fieldsValid) {
            return true
        }
        return false
    }

    return (

        <div>
            <div className="field">
                <label htmlFor="username" className="block text-900 font-medium mb-2">Username</label>
                <InputText className="w-full" id="username" type="text" value={props.self ? user.username : props.user.username} disabled />
            </div>
            <div className="field">
                <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                <Password className={"w-full" + (valid ? "" : " p-invalid")} feedback={false} inputClassName="w-full" id="password" toggleMask value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} />
                <small id="username-help" className={valid ? "" : " p-error"}>8 - 20 characters, at least one letter and one number</small>
            </div>
            <Messages className="w-full mb-3" ref={message}></Messages>
            <Button label="Confirm Change" icon="pi pi-tick" className="w-full" onClick={handleSubmit} />

        </div>
    );
}