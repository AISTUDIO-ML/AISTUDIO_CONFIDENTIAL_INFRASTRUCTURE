import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateVMModal from "./CreateVMModal";
import VMActionsModal from "./VMActionsModal";

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
  osImageId: string;
  osImageName: string;
  securityType: string;
  adminUsername: string;
  adminPasswordOrKey: string;
  authenticationType: string;
  publicIp?: string;
  status: string;
}

const BACK_URL = process.env.REACT_APP_BACKEND_URL;
const VMs = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedResource, setSelectedResource] = useState("");
  const [virtualMachines, setVirtualMachines] = useState<IVM[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateVMModal, setShowCreateVMModal] = useState(false);
  const [showVMActionsModal, setShowVMActionsModal] = useState(false);
  const [newVM, setNewVM] = useState<IVM>({
    id: "",
    resourceGroup: "",
    vmName: "",
    region: "",
    vmSize: "",
    osImageId: "",
    osImageName: "",
    securityType: "",
    adminUsername: "",
    adminPasswordOrKey: "",
    authenticationType: "",
    status: "",
    publicIp:"",  });

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

  const editVM = async (payload: IVM) => {
    setIsLoading(true);
    const response = await axios.put(`${BACK_URL}/vms/${payload.id}`, payload);
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
                setNewVM({
                  id: "",
                  resourceGroup: selectedResource,
                  vmName: "",
                  region: "",
                  vmSize: "Standard_DC2as_v5",
                  osImageId: "",
                  osImageName: "",
                  publicIp:"",
                  securityType: "ConfidentialVM",
                  adminUsername: "azureuser",
                  adminPasswordOrKey: "azureuUser!123",
                  authenticationType: "login",
                  status: "Creating",
                });
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
              <th>IP</th>
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
                <td>{vm.publicIp}</td>
                <td>{vm.status}</td>
                <td>
                  <button
                    onClick={() => {
                      setShowVMActionsModal(true);
                      setNewVM({
                        id: vm.id,
                        resourceGroup: vm.resourceGroup,
                        vmName: vm.vmName,
                        region: vm.region,
                        vmSize: vm.vmSize,
                        osImageId: vm.osImageId,
                        osImageName: vm.osImageName,
                        securityType: vm.securityType,
                        adminUsername: vm.adminUsername,
                        publicIp:vm.publicIp,
                        adminPasswordOrKey: vm.adminPasswordOrKey,
                        authenticationType: vm.authenticationType,
                        status: vm.status,
                      });
                    }}
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    Select
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setNewVM({
                        id: vm.id,
                        resourceGroup: vm.resourceGroup,
                        vmName: vm.vmName,
                        region: vm.region,
                        vmSize: vm.vmSize,
                        osImageId: vm.osImageId,
                        osImageName: vm.osImageName,
                        securityType: vm.securityType,
                        adminUsername: vm.adminUsername,
                        adminPasswordOrKey: vm.adminPasswordOrKey,
                        publicIp:vm.publicIp,
                        authenticationType: vm.authenticationType,
                        status: vm.status,
                      });
                      setShowCreateVMModal(true);
                    }}
                    className="btn btn-secondary "
                    disabled={isLoading}
                  >
                    Details
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
          onCancel={() => {
            setShowCreateVMModal(false);
          }}
          onSave={newVM.id ? editVM : createNewVM}
          isLoading={isLoading}
          newVM={newVM}
          setNewVM={setNewVM}
        />
      )}
      {showVMActionsModal && (
        <VMActionsModal
          id={newVM.id}
          status={newVM.status}
          isOpen={showVMActionsModal}
          onClose={() => {
            setShowVMActionsModal(false);
            fetchVMs(selectedResource);
          }}
        />
      )}
    </div>
  );
};

export default VMs;
