import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateVMModal from "./CreateVMModal";

interface Tenant {
  id: string;
  tenantName: string;
  resourceGroup: string;
  region: string;
}

export interface IVM {
  id?: string;
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
  const [virtualMachines, setVirtualMachines] = useState<IVM[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateVMModal, setShowCreateVMModal] = useState(false);

  useEffect(() => {
    fetchTenants();
  }, []);

  useEffect(() => {
    if (selectedResource) {
      fetchVMs(selectedResource);
    } else {
      setVirtualMachines([]);
    }
  }, [selectedResource]);

  const fetchTenants = async () => {
    const response = await axios.get(`${BACK_URL}/tenants`);
    setTenants(response.data);
  };

  const fetchVMs = async (resourceGroup: string) => {
    const response = await axios.get(
      `${BACK_URL}/vms/listAll/${resourceGroup}`
    );
    setVirtualMachines(response.data);
  };

  const getSingleVm = async (id: string) => {
    setIsLoading(true);
    const response = await axios.get(`${BACK_URL}/vms/${id}`);
    console.log("signle=>", response.data);
    setIsLoading(false);
  };

  const createNewVM = async (payload: IVM) => {
    setIsLoading(true);
    const response = await axios.post(`${BACK_URL}/vms`, payload);
    if (response.data) {
      fetchVMs(selectedResource);
      setShowCreateVMModal(false);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="container mt-4">
        <h2>Virtual Machine</h2>
        <div className="mb-3">
          <select
            className="form-control mb-2"
            value={selectedResource}
            onChange={(e) => {
              setSelectedResource(e.target.value);
            }}
          >
            <option value="">Select Tenant</option>
            {tenants.map((i) => {
              return <option value={i.resourceGroup}>{i.tenantName}</option>;
            })}
          </select>
          {selectedResource && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowCreateVMModal(true);
              }}
              disabled={isLoading}
            >
              Add VM
            </button>
          )}
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>VM Name</th>
              <th>Resource Group</th>
              <th>Region</th>
              <th>OS Image Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {virtualMachines.map((vm) => (
              <tr key={vm.id}>
                <td>{vm.vmName}</td>
                <td>{vm.resourceGroup}</td>
                <td>{vm.region}</td>
                <td>{vm.osImageName}</td>
                <td>{vm.status}</td>
                <td>
                  <button
                    onClick={() => {
                      getSingleVm(vm.id?.toString() || "");
                    }}
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showCreateVMModal && (
        <CreateVMModal
          isOpen={showCreateVMModal}
          resourceGroup={selectedResource}
          onCancel={() => {
            setShowCreateVMModal(false);
          }}
          onSave={createNewVM}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default VMs;
