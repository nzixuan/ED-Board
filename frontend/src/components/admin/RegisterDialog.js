import * as React from 'react';
import { useState, useRef, useContext } from 'react';
import axios from 'axios'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { RadioButton } from 'primereact/radiobutton';
import { Password } from 'primereact/password';
import { UserContext } from "../../context/UserContext";



export default function RegisterDialog(props) {
    const [user,] = useContext(UserContext)
    const message = useRef(null);
    const [state, setState] = useState({ username: '', password: '', role: '' })
    const [valid, setValid] = useState([true, true, true])
    const roles = ['user', 'admin']
    const canCreateRoles = { "super-admin": ['user', 'admin'], "admin": ["user"] }

    const handleSubmit = () => {

        if (fieldsValid()) {
            axios.post(process.env.REACT_APP_API_URL + '/api/edboard/user/register',
                { username: state.username, password: state.password, role: state.role }).then((res) => {
                    props.toast.current.show({ severity: 'info', summary: 'Success!', detail: 'User creation complete', life: 3000 });
                    props.setDisplayRegister(false)
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

    const userNameValid = (username) => {
        const re = new RegExp("^[A-Za-z0-9]{4,10}$");
        return re.test(username);
    }


    const passwordValid = (password) => {
        const re = new RegExp("^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9#$@!%&*?.]{8,20}$");
        return re.test(password);
    }

    const fieldsValid = () => {
        const fieldsValid = [userNameValid(state.username), passwordValid(state.password), state.role !== '']
        setValid(fieldsValid)

        if (fieldsValid[0] && fieldsValid[1] && fieldsValid[2]) {
            return true
        }
        return false
    }

    return (

        <div>
            <div className="field">
                <label htmlFor="username" className="block text-900 font-medium mb-2">Username</label>
                <InputText className={"w-full" + (valid[0] ? "" : " p-invalid")} id="username" type="text" value={state.username} onChange={(e) => setState({ ...state, username: e.target.value })} />
                <small id="username-help" className={valid[0] ? "" : " p-error"} >4 - 10 alphanumeric characters</small>
            </div>
            <div className="field">

                <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                <Password className={"w-full" + (valid[1] ? "" : " p-invalid")} feedback={false} inputClassName="w-full" id="password" toggleMask value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} />
                <small id="username-help" className={valid[1] ? "" : " p-error"}>8 - 20 characters, at least one letter and one number</small>
            </div>
            <div className=" field">
                <label htmlFor="role" className="block text-900 font-medium mb-2">Role</label>

                <div className="formgroup-inline pt-2" >
                    {roles.map((role) => {
                        return <div key={role} className="field-radiobutton pr-4">
                            <RadioButton className={valid[2] ? "" : " p-invalid"} inputId={role} name="role" value={role}
                                disabled={!canCreateRoles[user.role] || !canCreateRoles[user.role].includes(role)} onChange={(e) => setState({ ...state, role: e.value })} checked={state.role === role} />
                            <label htmlFor={role}>{role}</label>
                        </div>
                    })}
                </div>
            </div>
            <Messages className="w-full mb-3" ref={message}></Messages>
            <Button label="Sign Up" icon="pi pi-user" className="w-full" onClick={handleSubmit} />

        </div>
    );
}