import React, { useEffect, useState } from "react";
import { IVM } from "./VMs";

interface CreateVMModalProps {
  isOpen: boolean;
  onSave: (payload:IVM) => void;
  onCancel: () => void;
  isLoading:boolean;
  newVM:IVM;
  setNewVM:(payload:IVM) => void;
}

const CreateVMModal: React.FC<CreateVMModalProps> = ({
  isOpen,
  onSave,
  onCancel,
  isLoading,
  newVM,
  setNewVM
}) => {

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setNewVM({ ...newVM, [e.target.name]: e.target.value });
  };

  const handleOSImageChange = (e: { target: { name: any; value: any } }) => {
    setNewVM({
      ...newVM,
      [e.target.name]: e.target.value,
      osImageName: e.target.value
        ? e.target.value === "id1"
          ? "Windows 11 Pro, version 22H2 - x64 Gen2"
          : "Ubuntu Server 22.04 LTS (Confidential VM) - x64 Gen2"
        : "",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">VM Details</h5>
          </div>
          <div className="modal-body">
            <div className="d-flex mb-2  align-items-center ">
              <h6 className="w-25 ">Vm Name</h6>
              <input
                type="text"
                className="form-control w-75 "
                name="vmName"
                disabled={Boolean(newVM.id)}
                value={newVM.vmName}
                onChange={handleInputChange}
              />
            </div>
            <div className="d-flex mb-2  align-items-center ">
              <h6 className="w-25 ">Region</h6>
              <select
                className="form-control w-75"
                name="region"
                value={newVM.region}
                disabled={Boolean(newVM.id)}
                onChange={handleInputChange}
              >
                <option value=""></option>
                <option value="eastus">(US) East US</option>
                <option value="westus">(US) West US</option>
              </select>
            </div>
            <div className="d-flex mb-2  align-items-center ">
              <h6 className="w-25 ">Vm Size</h6>
              <input
                type="text"
                className="form-control w-75 "
                name="vmSize"
                value={newVM.vmSize}
                disabled
                onChange={handleInputChange}
              />
            </div>
            <div className="d-flex mb-2  align-items-center ">
              <h6 className="w-25 ">Os Image</h6>
              <select
                className="form-control w-75"
                name="osImageId"
                value={newVM.osImageId}
                onChange={handleOSImageChange}
                disabled={Boolean(newVM.id)}
              >
                <option value=""></option>
                <option value="id1">
                  Windows 11 Pro, version 22H2 - x64 Gen2
                </option>
                <option value="id2">
                  Ubuntu Server 22.04 LTS (Confidential VM) - x64 Gen2
                </option>
              </select>
            </div>
            <div className="d-flex mb-2  align-items-center ">
              <h6 className="w-25 ">Security Type</h6>
              <input
                type="text"
                className="form-control w-75 "
                name="securityType"
                value={newVM.securityType}
                disabled
                onChange={handleInputChange}
              />
            </div>
            <div className="d-flex mb-2  align-items-center ">
              <h6 className="w-25 ">Admin User Name</h6>
              <input
                type="text"
                className="form-control w-75 "
                name="adminUsername"
                disabled={Boolean(newVM.id)}
                value={newVM.adminUsername}
                onChange={handleInputChange}
              />
            </div>
            <div className="d-flex mb-2  align-items-center ">
              <h6 className="w-25 ">Admin Password</h6>
              <input
                type="text"
                className="form-control w-75 "
                name="adminPasswordOrKey"
                disabled={Boolean(newVM.id)}
                value={newVM.adminPasswordOrKey}
                onChange={handleInputChange}
              />
            </div>
            <div className="d-flex mb-2  align-items-center ">
              <h6 className="w-25 ">Authentication Type</h6>
              <input
                type="text"
                className="form-control w-75 "
                name="authenticationType"
                disabled
                value={newVM.authenticationType}
                onChange={handleInputChange}
              />
            </div>
            {Boolean(newVM.id)&&<div className="d-flex mb-2  align-items-center ">
              <h6 className="w-25 ">Public IP</h6>
              <input
                type="text"
                className="form-control w-75 "
                name="publicIp"
                disabled
                value={newVM.publicIp}
                onChange={handleInputChange}
              />
            </div>}
            {Boolean(newVM.id)&&<div className="d-flex mb-2  align-items-center ">
              <h6 className="w-25 ">Status</h6>
              <input
                type="text"
                className="form-control w-75 "
                name="status"
                disabled
                value={newVM.status}
                onChange={handleInputChange}
              />
            </div>}
          </div>
          <div className="modal-footer">
            {!Boolean(newVM.id)&&<button
              onClick={()=>{onSave(newVM)}}
              className="btn btn-primary"
              disabled={
                !newVM.resourceGroup||
                !newVM.vmName ||
                !newVM.region ||
                !newVM.vmSize ||
                !newVM.osImageId ||
                !newVM.osImageName ||
                !newVM.securityType ||
                !newVM.adminUsername ||
                !newVM.adminPasswordOrKey ||
                !newVM.authenticationType||isLoading
              }
            >
              Save
            </button>}
            <button onClick={onCancel} className="btn btn-danger" disabled={isLoading}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVMModal;
