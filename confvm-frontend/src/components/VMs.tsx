import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VMs = () => {
  const [tenants, setTenants] = useState([]);
  const [newTenant, setNewTenant] = useState({ tenantName: '', resourceGroup: '', region: '' });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    const response = await axios.get('http://localhost:3000/tenants');
    setTenants(response.data);
  };

  const addTenant = async () => {
    await axios.post('http://localhost:3000/tenants', newTenant);
    fetchTenants(); // Refresh the list
  };


  // Render the UI for tenants
  return (
    <div>
      <h2>Tenants</h2>
      {/* Form for adding a new tenant */}
      {/* List of tenants with delete button */}
    </div>
  );
};

export default VMs;
