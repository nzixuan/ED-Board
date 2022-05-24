import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Home() {
    const [user, setUser] = useContext(UserContext)

    return (
        <div className="h-screen -my-12 flex flex-col items-center justify-center">
            <h1>{user.username}</h1>
        </div>
    )
}

export default Home;