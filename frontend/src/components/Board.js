import React, { Component } from "react";
import axios from 'axios'

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Table from "./Table";
import BoardHeader from "./ BoardHeader";
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import "./Board.css"
class Board extends Component {
    constructor(props) {
        super(props);
        this.state = { rosters: [], time: new Date(0) };
        this.loadData = this.loadData.bind(this);
    }



    async loadData() {
        try {
            //TODO: Change date
            const data = await axios.get(process.env.REACT_APP_API_URL + '/api/edboard/roster/', { params: { date: "05/26/2022", board: this.props.name } })
            console.log(data)
            let rosters = data.data
            rosters.sort((a, b) => {
                if (a.staffType === "doctor") {
                    return -1
                } else if (b.staffType === "doctor") {
                    return 1
                } else if (a.staffType === "nurse") {
                    return -1
                } else if (b.staffType === "nurse") {
                    return 1
                } else {
                    return a.staffType - b.staffType
                }
            })

            this.setState({ rosters: rosters, time: new Date() })
        } catch (err) {
            //TODO: Log Error on screen
            // this.setState({ rosters: [] })
        }
    };


    componentDidMount() {
        this.interval = setInterval(this.loadData, 10000);
        this.loadData()
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }


    render() {

        return (
            <div className="Board">
                <BoardHeader time={this.state.time} name={this.props.name}></BoardHeader>
                {/* Max height */}
                <div className=" flex items-center justify-center flex-wrap" >
                    {
                        this.state.rosters.length > 0 && this.state.rosters.map((roster) => {
                            if (roster.roster.length > 0)
                                return <Table roster={roster} key={roster.staffType}></Table>
                        })
                    }

                </div>
            </div >
        )
    }
}

export default Board;