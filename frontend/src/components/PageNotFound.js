// import pagenotfound from '../assets/pagenotfound.svg'
import React, { Component } from "react";
import axios from 'axios'
import { Link } from 'react-router-dom'


class PageNotFound extends Component {
    constructor(props) {
        super(props);
        this.state = { audits: [] };
        this.loadData = this.loadData.bind(this);

    }

    async loadData() {
        try {
            const data = await axios.get(process.env.REACT_APP_API_URL + '/api/edboard/audit?date=2022%2F05%2F27')
            this.setState({ audits: data.data.audits })
        } catch (err) {
            this.setState({ audits: [] })
        }
    };


    componentDidMount() {
        this.interval = setInterval(this.loadData, 10000);
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
                <h1>{this.state.audits.length}</h1>
            </div>
        )
    }
}

export default PageNotFound;