import React, { useContext } from "react";
import { Button } from 'primereact/button';
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function SideNavBar() {
    const items = [{ label: "Roster", pathname: "/admin", icon: "pi pi-book" },
    { label: "Audit Log", pathname: "/admin/audit", icon: "pi pi-clock" },
    { label: "Board Config", pathname: "/admin/config", icon: "pi pi-cog" }]

    // { "Roster": "/admin", "Audit Log": "/admin/audit", "Config": "/admin/config" }

    const [user,] = useContext(UserContext)
    const navigate = useNavigate();
    let location = useLocation();
    const current = "p-button-text text-sm w-8rem text-white surface-800 h-3rem my-1"
    const away = "p-button-text text-sm w-8rem text-white h-3rem my-1"

    return (
        < div className="flex flex-column align-items-center justify-content-start fixed surface-900  h-screen w-9rem z-5 py-4" >
            {/* <Button label="Roster" icon="pi pi-book" className={location.pathname === paths["Roster"] ? current : nav} onClick={()=>navigate(paths["Roster"])}/>
            <Button label="Audit Log" icon="pi pi-book" className={location.pathname === paths["Audit Log"] ? current : nav} onClick={()=>navigate(paths["Roster"])}/>
            <Button label="Config" icon="pi pi-book" className={location.pathname === paths["Config"] ? current : nav} /> */}
            {items.map((item) => <Button label={item.label} icon={item.icon} className={location.pathname === item.pathname ? current : away} onClick={() => navigate(item.pathname)} />)}
        </div >
    )
}

export default SideNavBar;