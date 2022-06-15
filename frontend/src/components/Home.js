import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";

function Home() {
    const [user,] = useContext(UserContext)
    const navigate = useNavigate();

    return (
        <div className="flex align-items-center justify-content-center ">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4 my-6">
                <div className="text-center mb-5">
                    <div className="text-900 text-3xl font-medium mb-3">Welcome {user.username}</div>
                </div>
                <div>
                    <Button label="Create/Edit Roster" icon="pi pi-plus" className="w-full mb-6" onClick={() => navigate("/admin/create")} />
                    <Button label="Delete Roster" icon="pi pi-pencil" className="w-full mb-6" />
                    <Button label="View Audit Trail" icon="pi pi-database" className="w-full mb-6" />
                </div>
            </div>
        </div>
    )
}

export default Home;