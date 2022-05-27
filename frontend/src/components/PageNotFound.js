// import pagenotfound from '../assets/pagenotfound.svg'
import React, { Component } from "react";

import { Link } from 'react-router-dom'

class PageNotFound extends Component {
    constructor(props) {
        super(props);
        this.state = { time: Date.now() };
    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        return (
            <div className="h-screen -my-12 flex flex-col items-center justify-center">
                <p className="text-white p-5 text-3xl sm:text-5xl font-extrabold">Page Not Found</p>
                <Link to="/" className="text-2xl underline text-green-400">Return Home</Link>
                {/* <img className="p-5" src={pagenotfound} alt="404 Error" /> */}
                <h1>{this.state.time}</h1>
            </div>
        )
    }
}

export default PageNotFound;