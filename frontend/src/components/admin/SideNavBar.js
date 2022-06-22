import React, { useContext } from "react";
import { Button } from 'primereact/button';
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { Divider } from 'primereact/divider';
import "./SideNavBar.css"


function SideNavBar() {
    const items = [{ label: "Create Roster", pathname: "/admin", icon: "pi pi-book" },
    { label: "Audit Log", pathname: "/admin/audit", icon: "pi pi-clock" },
    { label: "Board Config", pathname: "/admin/config", icon: "pi pi-cog" }]

    const [user,] = useContext(UserContext)
    const navigate = useNavigate();
    let location = useLocation();

    return (
        < div className="bar" >
            <Button disabled label="ED Roster System" icon="pi pi-bars" className=" navigation-button system"></Button>
            <Divider className="divider" />
            {items.map((item) => <Button className={location.pathname === item.pathname ?
                " navigation-button navigation-current" : " navigation-button navigation-away"}
                label={item.label} icon={item.icon} onClick={() => navigate(item.pathname)} />)}
        </div >
    )
}

export default SideNavBar;