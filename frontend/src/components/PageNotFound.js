import React, { Component } from "react";
import { Link } from 'react-router-dom'


class PageNotFound extends Component {

    render() {
        return (
            <div className="h-screen -my-12 flex flex-column items-center justify-center">
                <p className="px-2 text-3xl sm:text-5xl font-extrabold">Page Not Found</p>
                <Link to="/" className="mx-2 text-2xl underline text-green-400">Return Home</Link>
            </div>
        )
    }
}

export default PageNotFound;