import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteConfirmationModal from './DeleteConfirmationModal';


interface Tenant {
    id: string;
    tenantName: string;
    resourceGroup: string;
    region: string;
}

interface Resource {
    id: string;
    name: string;
    type: string;
  }
const BACK_URL = process.env.REACT_APP_BACKEND_URL;
const Tenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [newTenant, setNewTenant] = useState({ tenantName: '', resourceGroup: '', region: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  //const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(new Map());
  const [deleteMessages, setDeleteMessages] = useState(new Map());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResources, setCurrentResources] = useState<Resource[]>([]);

  const [currentTenantId, setCurrentTenantId] = useState(null);


  const [messageDelete, setMessageDelete] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    const response = await axios.get(`${BACK_URL}/tenants`);
    setTenants(response.data);
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    setNewTenant({ ...newTenant, [e.target.name]: e.target.value });
  };

  const handleRegionChange = (e: { target: { value: any; }; }) => {
    setNewTenant({ ...newTenant, region: e.target.value });
  };

  const addTenant = async () => {
    if (newTenant.tenantName && newTenant.resourceGroup && newTenant.region) {
      setIsLoading(true); // Start loading
      setMessage(''); // Reset message
      try {
        await axios.post(`${BACK_URL}/tenants`, newTenant);
        fetchTenants(); // Refresh the list
        setNewTenant({ tenantName: '', resourceGroup: '', region: '' }); // Reset form
        setMessage('Tenant added successfully!'); // Set success message
      } catch (error) {
        setMessage('Failed to add tenant.'); // Set error message
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };
  



  const deleteTenant = async (id: any) => {
    // Set loading to true for the specific tenant
    setDeleteLoading(prev => new Map(prev).set(id, true));
    setDeleteMessages(prev => new Map(prev).set(id, 'Deleting...'));
    //setMessageDelete('Deleting...');
  
    try {
      await axios.delete(`${BACK_URL}/tenants/${id}`);
      //setMessageDelete(`${id} Deleted successfully!`);
      setDeleteMessages(prev => new Map(prev).set(id, `${id} Deleted successfully!`));

      fetchTenants(); // Refresh the list
    } catch (error) {
      //setMessageDelete('Failed to delete All resources for this group.');
      setDeleteMessages(prev => new Map(prev).set(id, 'Failed to delete all resources for this group.'));

    } finally {
      // Set loading to false for the specific tenant
      setDeleteLoading(prev => new Map(prev).set(id, false));
    }
  };

  const fetchResourcesForGroup = async (resourceGroup: any) => {
    try {
      const response = await axios.get(`${BACK_URL}/tenants/listAllResources/${resourceGroup}`);
      return response.data; // This will be the list of resources
    } catch (error) {
      console.error('Error fetching resources:', error);
      // Handle error appropriately
    }
  };

  const handleDeleteClick = async (tenant: any) => {
    const resources = await fetchResourcesForGroup(tenant.resourceGroup);
    console.log('InTenants: ', resources); // Check the structure here
    setCurrentResources(resources);
    setCurrentTenantId(tenant.resourceGroup);
    setIsModalOpen(true);
  };

  const confirmDeletion = async () => {
    setIsModalOpen(false);
    await deleteTenant(currentTenantId);
  };
  
  const cancelDeletion = () => {
    setIsModalOpen(false);
    // Reset states or perform any other necessary cleanup
  };

  return (
    <div>
    <div className="container mt-4">
      <h2>Tenants</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          name="tenantName"
          placeholder="Tenant Name"
          value={newTenant.tenantName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          className="form-control mb-2"
          name="resourceGroup"
          placeholder="Resource Group"
          value={newTenant.resourceGroup}
          onChange={handleInputChange}
        />
        <select
          className="form-control mb-2"
          value={newTenant.region}
          onChange={handleRegionChange}
        >
          <option value="">Select Region</option>
          <option value="eastus">(US) East US</option>
          <option value="westus">(US) West US</option>
        </select>
        <button className="btn btn-primary" onClick={addTenant} disabled={isLoading}>
        {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Add Tenant'}
      </button>

      {/* Display message */}
      {message && <div className="alert alert-info mt-2">{message}</div>}

      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Tenant Name</th>
            <th>Resource Group</th>
            <th>Region</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td>{tenant.tenantName}</td>
              <td>{tenant.resourceGroup}</td>
              <td>{tenant.region}</td>
              <td>
              <button className="btn btn-danger" onClick={() => handleDeleteClick(tenant)}>
                 {deleteLoading.get(tenant.resourceGroup) ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                    'Delete'
                    )}
                </button>
            {deleteMessages.get(tenant.resourceGroup) && <div className="alert alert-info mt-2">{deleteMessages.get(tenant.resourceGroup)}</div>}
              </td>
            </tr>
            
          ))}
        </tbody>
      </table>
    </div>
    <DeleteConfirmationModal
      isOpen={isModalOpen}
      resources={currentResources}
      onConfirm={confirmDeletion}
      onCancel={cancelDeletion}
    />
    </div>
  );
};

export default Tenants;