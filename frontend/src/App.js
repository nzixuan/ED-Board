import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from './components/PageNotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home'
import SignIn from "./components/SignIn";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<SignIn />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route path="hi" element={<Home />} />
            <Route path="me" element={<Home />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
