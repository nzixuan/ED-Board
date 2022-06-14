import React from "react";
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from './components/PageNotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home'
import SignIn from "./components/SignIn";
import LandingPage from "./components/LandingPage";
import { UserProvider } from "./context/UserContext";
import CreateRoster from "./components/CreateRoster";
import Board from "./components/Board"
import axios from "axios";

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
              <Route path="" element={<Home />} />
              <Route path="create" element={<CreateRoster />} />
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
