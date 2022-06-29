import React from "react";
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from './components/PageNotFound';
import ProtectedRoute from './components/admin/ProtectedRoute';
import SignIn from "./components/SignIn";
import LandingPage from "./components/LandingPage";
import { UserProvider } from "./context/UserContext";
import CreateRoster from "./components/admin/CreateRoster";
import ConfigView from "./components/admin/ConfigView"
import Board from "./components/board/Board"
import axios from "axios";
import AuditTrailView from "./components/admin/AuditTrailView";
import RosterView from "./components/admin/RosterView";

function App() {
  const [boards, setBoards] = useState([]);
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/api/edboard/config/boards').then((res) => { setBoards(res.data) }).catch((err) => { setBoards([]) })
  }, []);

  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<LandingPage boards={boards} />} />
            <Route exact path="/login" element={<SignIn />} />
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route path="" element={<RosterView />} />
              <Route path="audit" element={<AuditTrailView />} />
              <Route path="config" element={<ConfigView />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
            < Route path="/create" element={<CreateRoster />} />
            {
              boards.map((board) => { return <Route path={"/" + board} element={<Board name={board} />} key={board} /> }
              )
            }
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div >
  );
}

export default App;
