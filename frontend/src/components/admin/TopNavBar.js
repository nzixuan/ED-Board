import React, { useContext } from "react";
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function TopNavBar() {
    const [user,] = useContext(UserContext)
    const navigate = useNavigate();

    return (
        <div className="flex align-items-center justify-content-between bg-primary fixed w-screen h-2rem z-5" >
            <h4 className="m-2">TTSH Emergency Department Roster System</h4>

            <div className="flex align-items-center justify-content-center m-3" >
                <a className="flex align-items-center no-underline justify-content-center border-round p-2
            text-100 hover:bg-bluegray-700 cursor-pointer transition-colors transition-duration-150 " style={{ height: '2rem' }} onClick={() => navigate("/")}>
                    <i className="pi pi-table" ></i>
                    <h4 className="p-2">Boards</h4>

                </a>
                <div className="flex align-items-center no-underline justify-content-center border-round p-2
            text-100 hover:bg-bluegray-700 cursor-pointer transition-colors transition-duration-150"
                    style={{ height: '2rem' }}>
                    <i className="pi pi-user"></i>
                    <h4 className="p-2">{user.username}</h4>
                </div >
            </div>
        </div >
    )
}

export default TopNavBar;