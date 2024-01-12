import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Tenants from './components/Tenants';
import VMs from './components/VMs';

function App() {
  return (
    <Router>
      <div>
        <nav className="nav nav-tabs">
          <NavLink 
            to="/tenants" 
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            Tenants
          </NavLink>
          <NavLink 
            to="/vms" 
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            VMs
          </NavLink>
        </nav>
        <div className="tab-content" style={{ paddingTop: "10px" }}>
          <Routes>
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/vms" element={<VMs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
