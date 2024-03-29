import React, { Component } from "react";
import axios from 'axios'


import Table from "./Table";
import BoardHeader from "./ BoardHeader";
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import "./Board.css"
class Board extends Component {
    constructor(props) {
        super(props);
        this.state = { rosters: [], time: "-", date: "-", error: false };
        this.loadData = this.loadData.bind(this);
    }



    async loadData() {
        try {
            //TODO: Remove date
            const data = await axios.get(process.env.REACT_APP_API_URL + '/api/edboard/roster/', { params: { board: this.props.name } })
            let rosters = data.data.rosters
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

            //For striped classing
            rosters.forEach((rosters) => {
                const roster = rosters.roster

                let previous = null;
                let alt = "striped";
                for (let i = 0; i < roster.length; i++) {

                    if (previous !== roster[i].assignment) {
                        if (alt === "striped") {
                            alt = "nostriped"
                        } else {
                            alt = "striped"
                        }
                        previous = roster[i].assignment
                    }
                    roster[i]["stripe"] = alt;
                }
            });

            this.setState({ rosters: rosters, time: data.data.timeString, date: data.data.dateString, error: false })
        } catch (err) {
            //TODO: Log Error on screen
            this.setState({ ...this.state, error: true })
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
            <div className="board">
                <BoardHeader time={this.state.time} date={this.state.date} name={this.props.name} error={this.state.error}></BoardHeader>
                <div className="tables" >
                    {
                        this.state.rosters.length > 0 && this.state.rosters.map((roster, index) => {
                            if (roster.roster.length > 0)
                                return <Table roster={roster} key={roster.staffType} className={index % 2 === 0 ? "red" : "brown"}></Table>
                            return null
                        })
                    }
                </div>
            </div >
        )
    }
}

export default Board;