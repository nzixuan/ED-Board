import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from './components/PageNotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home'
import SignIn from "./components/SignIn";
import { UserProvider } from "./context/UserContext";
import CreateRoster from "./components/CreateRoster";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/login" element={<SignIn />} />
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route path="" element={<Home />} />
              <Route path="create" element={<CreateRoster />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
            <Route path="/create" element={<CreateRoster />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div >
  );
}

export default App;
