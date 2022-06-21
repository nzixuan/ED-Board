import React, { useContext } from "react";
import { Button } from 'primereact/button';
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function SideNavBar() {
    const items = [{ label: "Create Roster", pathname: "/admin", icon: "pi pi-book" },
    { label: "Audit Log", pathname: "/admin/audit", icon: "pi pi-clock" },
    { label: "Board Config", pathname: "/admin/config", icon: "pi pi-cog" }]

    const [user,] = useContext(UserContext)
    const navigate = useNavigate();
    let location = useLocation();
    const current = "p-button-text text-sm w-8rem text-white surface-800 h-3rem my-1"
    const away = "p-button-text text-sm w-8rem text-white h-3rem my-1"

    return (
        < div className="flex flex-column align-items-center justify-content-start fixed surface-900  h-screen w-9rem z-5 py-4" >
            {items.map((item) => <Button label={item.label} icon={item.icon} className={location.pathname === item.pathname ? current : away} onClick={() => navigate(item.pathname)} />)}
        </div >
    )
}

export default SideNavBar;