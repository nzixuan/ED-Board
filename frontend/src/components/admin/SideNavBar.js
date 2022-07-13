import React, { useState, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { Divider } from 'primereact/divider';
import axios from "axios";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import "./SideNavBar.css"


function SideNavBar() {
    const toast = useRef(null);

    const [user,] = useContext(UserContext)
    const navigate = useNavigate();
    let location = useLocation();
    const [changePassword, setChangePassword] = useState(false)


    const items = user.role === "admin" || user.role === "super-admin" ? [{ label: "Edit Roster", pathname: "/admin", icon: "pi pi-book" },
    { label: "Audit Log", pathname: "/admin/audit", icon: "pi pi-clock" },
    { label: "Board Config", pathname: "/admin/config", icon: "pi pi-cog" },
    { label: "User Manager", pathname: "/admin/users", icon: "pi pi-users" }] :
        [{ label: "Edit Roster", pathname: "/admin", icon: "pi pi-book" },
        { label: "Audit Log", pathname: "/admin/audit", icon: "pi pi-clock" }]

    const signOut = () => {
        localStorage.removeItem('token')
        axios.post(process.env.REACT_APP_API_URL + '/api/edboard/user/logout', { username: user.username })
        navigate("/login")
    }

    return (
        < div className="bar" >
            <Toast ref={toast} />
            <div className="topbar"
            >
                <i className="pi pi-bars icon"></i>
                <h4 className="logo" onClick={() => navigate("/admin")}>ED Roster System</h4>
            </div >
            {/* <Button disabled label="ED Roster System" icon="pi pi-bars" className=" navigation-button system"></Button> */}
            <Divider className="divider" />
            <h4 className="m-2 mt-3">{"Hello, " + user.username}</h4>
            <Divider className="divider" />
            {items.map((item) => <MenuButton className={location.pathname === item.pathname ?
                "navigation-button navigation-current" : "navigation-button navigation-away"}
                label={item.label} icon={item.icon} onClick={() => navigate(item.pathname)} key={item.label} />)}
            <Divider className="divider" />
            <MenuButton className="navigation-button navigation-away" label="Change Password" icon="pi pi-id-card" onClick={() => setChangePassword(true)}></MenuButton>
            <Dialog visible={changePassword} className="w-full lg:w-3 md:w-6" contentClassName='border-round-bottom' header={"Change Password"}
                resizable={false} blockScroll draggable={false} onHide={() => setChangePassword(false)}>
                <ChangePasswordDialog setChangePassword={setChangePassword} toast={toast} self={true}></ChangePasswordDialog>
            </Dialog>

            <MenuButton className="navigation-button navigation-away" label="Sign Out" icon="pi pi-user-minus" onClick={signOut}></MenuButton>

        </div >
    )
}

function MenuButton(props) {
    return (
        <div className={"menu-button " + props.className} onClick={props.onClick}
        >
            <i className={"menu-icon " + props.icon} ></i>
            <h4 className="menu-label">{props.label}</h4>
        </div >
    )
}



export default SideNavBar;