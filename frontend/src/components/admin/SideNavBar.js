import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { Divider } from 'primereact/divider';
import axios from "axios";

import "./SideNavBar.css"


function SideNavBar() {
    const items = [{ label: "Edit Roster", pathname: "/admin", icon: "pi pi-book" },
    { label: "Audit Log", pathname: "/admin/audit", icon: "pi pi-clock" },
    { label: "Board Config", pathname: "/admin/config", icon: "pi pi-cog" }]

    const [user,] = useContext(UserContext)
    const navigate = useNavigate();
    let location = useLocation();

    const signOut = () => {
        localStorage.removeItem('token')
        axios.post(process.env.REACT_APP_API_URL + '/api/edboard/user/logout', { username: user.username })
        navigate("/login")
    }

    return (
        < div className="bar" >
            <div className="topbar"
            >
                <i className="pi pi-bars icon"></i>
                <h4 className="logo" onClick={() => navigate("/admin")}>ED Roster System</h4>
            </div >
            {/* <Button disabled label="ED Roster System" icon="pi pi-bars" className=" navigation-button system"></Button> */}
            <Divider className="divider" />
            {items.map((item) => <MenuButton className={location.pathname === item.pathname ?
                "navigation-button navigation-current" : "navigation-button navigation-away"}
                label={item.label} icon={item.icon} onClick={() => navigate(item.pathname)} key={item.label} />)}
            <Divider className="divider" />
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