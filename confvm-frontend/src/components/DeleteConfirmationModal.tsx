import React from 'react';

  interface Resource {
    id: string;
    name: string;
    type: string;
  }

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  resources: Resource[]; // Adjust this type based on what resources actually are
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
    isOpen, 
    resources, 
    onConfirm, 
    onCancel 
  }) => {
    if (!isOpen) return null;

    return (
      <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Deletion</h5>
            </div>
            <div className="modal-body">
              {resources && resources.length > 0 ? (
                <ul>
                {resources.map((resource, index) => (
                  <li key={index}>
                    Name: {resource.name}, Type: {resource.type}
                  </li>
                ))}
              </ul>
              ) : (
                <p>No resources to display.</p>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={onConfirm} className="btn btn-danger">Confirm</button>
              <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default DeleteConfirmationModal;
