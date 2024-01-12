import React, { useState, useEffect } from "react";
import axios from "axios";

interface Tenant {
  id: string;
  tenantName: string;
  resourceGroup: string;
  region: string;
}

interface VM {
  id: string;
  resourceGroup: string;
  vmName: string;
  region: string;
  vmSize: string;
  osImageName: string;
  securityType: string;
  adminUsername: string;
  adminPasswordOrKey: string;
  authenticationType: string;
  status: string;
}

const BACK_URL = process.env.REACT_APP_BACKEND_URL;
const VMs = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedResource, setSelectedResource] = useState("");
  const [virtualMachines, setVirtualMachines] = useState<VM[]>([]);

  useEffect(() => {
    fetchTenants();
  }, []);

  useEffect(() => {
    setVirtualMachines([]);
  }, [selectedResource]);

  const fetchTenants = async () => {
    const response = await axios.get(`${BACK_URL}/tenants`);
    setTenants(response.data);
  };

  return (
    <div>
      <div className="container mt-4">
        <h2>Virtual Machine</h2>
        <div className="mb-3">
          <div className="d-flex mt-4 ">
            <h6 className="mb-2 w-25">Resource Group</h6>
            <select
              className="form-control mb-2"
              value={selectedResource}
              onChange={(e) => {
                setSelectedResource(e.target.value);
              }}
            >
              <option value="">Select Resource</option>
              {tenants.map((i) => {
                return <option value={i.resourceGroup}>{i.tenantName}</option>;
              })}
            </select>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Resource Group</th>
              <th>VM Name</th>
              <th>Region</th>
              <th>VM Size</th>
              <th>OS Image Name</th>
              <th>Security Type</th>
              <th>Admin Username</th>
              <th>Admin Password Or Key</th>
              <th>Authentication Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {virtualMachines.map((vm) => (
              <tr key={vm.id}>
                <td>{vm.id}</td>
                <td>{vm.resourceGroup}</td>
                <td>{vm.vmName}</td>
                <td>{vm.region}</td>
                <td>{vm.vmSize}</td>
                <td>{vm.osImageName}</td>
                <td>{vm.securityType}</td>
                <td>{vm.adminUsername}</td>
                <td>{vm.adminPasswordOrKey}</td>
                <td>{vm.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VMs;
