import React, { useEffect, useState } from "react";
import axios from "axios";

interface CreateVMModalProps {
  isOpen: boolean;
  id?: string;
  status: string;
  onClose: () => void;
}

const BACK_URL = process.env.REACT_APP_BACKEND_URL;

const VMActionsModal: React.FC<CreateVMModalProps> = ({
  isOpen,
  id,
  status,
  onClose,
}) => {
  const [isDeployingMessage, setIsDeployingMessage] = useState("");
  const [isStartingMessage, setIsStartingMessage] = useState("");
  const [isStopingMessage, setIsStopingMessage] = useState("");
  const [isDeletingMessage, setIsDeletingMessage] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStoping, setIsStoping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [response, setResponse] = useState("");

  const deploy = async (id: string) => {
    setIsDeploying(true);
    setIsDeployingMessage("Deploying...");
    const response = await axios.post(`${BACK_URL}/vms/deployVm/${id}`);
    if (response.data) {
      setResponse(response.data);
      setIsDeployingMessage("");
    }
    setIsDeploying(false);
  };

  const start = async (id: string) => {
    setIsStarting(true);
    setIsStartingMessage("Starting...");
    const response = await axios.post(`${BACK_URL}/vms/startVm/${id}`);
    if (response.data) {
      setResponse(response.data);
      setIsStartingMessage("");
    }
    setIsStarting(false);
  };

  const stop = async (id: string) => {
    setIsStoping(true);
    setIsStopingMessage("Stoping...");
    const response = await axios.post(`${BACK_URL}/vms/stopVm/${id}`);
    if (response.data) {
      setResponse(response.data);
      setIsStopingMessage("");
    }
    setIsStoping(false);
  };

  const deleting = async (id: string) => {
    setIsDeleting(true);
    setIsDeletingMessage("Deleting...");
    const response = await axios.post(`${BACK_URL}/vms/deleteVm/${id}`);
    if (response.data) {
      setResponse(response.data);
      setIsDeletingMessage("");
    }
    setIsDeleting(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog" style={{minWidth:"50%"}}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">VM Actions</h5>
          </div>
          <div className="modal-body">
            <div className="d-flex mb-5 justify-content-around  ">
              <div>
                <button
                  className="btn  btn-primary"
                  disabled={status !== "Creating"}
                  onClick={() => deploy(id || "")}
                >
                  {isDeploying ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Deploy"
                  )}
                </button>
                {isDeployingMessage && (
                  <div className="alert alert-info mt-2">
                    {isDeployingMessage}
                  </div>
                )}
              </div>
              <div>
                <button
                  className="btn  btn-success"
                  disabled={status === "Creating"}
                  onClick={() => start(id || "")}
                >
                  {isStarting ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Start"
                  )}
                </button>
                {isStartingMessage && (
                  <div className="alert alert-info mt-2">
                    {isStartingMessage}
                  </div>
                )}
              </div>
              <div>
                <button
                  className="btn  btn-danger"
                  disabled={status === "Creating"}
                  onClick={() => stop(id || "")}
                >
                  {isStoping ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Stop"
                  )}
                </button>
                {isStopingMessage && (
                  <div className="alert alert-info mt-2">
                    {isStopingMessage}
                  </div>
                )}
              </div>
              <div>
                <button
                  className="btn  btn-danger"
                  disabled={status === "Creating"}
                  onClick={() => deleting(id || "")}
                >
                  {isDeleting ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Delete"
                  )}
                </button>
                {isDeletingMessage && (
                  <div className="alert alert-info mt-2">
                    {isDeletingMessage}
                  </div>
                )}
              </div>
            </div>
            <textarea
              className="form-control"
              name="response"
              value={response}
              disabled
              rows={7}
            />
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-danger">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VMActionsModal;
