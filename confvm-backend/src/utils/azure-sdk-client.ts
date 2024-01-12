import { ComputeManagementClient } from "@azure/arm-compute";
import { ClientSecretCredential } from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";
import  { NetworkManagementClient }  from "@azure/arm-network";

// Define your credentials (better to use environment variables for security)
const clientId = 'f17b9192-f2ac-48f2-b397-d1b02a4b2597';
const clientSecret = 'VOL8Q~iNxaPE4-i8ePR.vmwXQt.dLmTjFP2e6b2o';
const tenantId = '7b678424-f3a4-4f41-a141-ff86895e9117';
const subscriptionId = '6f6284ea-6f7d-4eea-b893-68bf8e9399c6';

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
const resourceClient = new ResourceManagementClient(credential, subscriptionId);
const computeClient = new ComputeManagementClient(credential, subscriptionId);
const networkClient = new NetworkManagementClient(credential, subscriptionId);



export async function deallocateVirtuakMachine(vm) {
  //deallocate do not get charged
  console.log("\nDeallocate Confidential VM: " + vm.vmName);
  const hibernate = false;
  const options = { hibernate };
  const result_deallocate = await computeClient.virtualMachines.beginDeallocateAndWait(
    vm.resourceGroup,
    vm.vmName,
    options,
  );
  console.log(result_deallocate);
  return result_deallocate;
}

export async function startVirtualMachineStart(vm) {
  console.log("\nStart Confidential VM: " + vm.vmName);
  const result_start = await computeClient.virtualMachines.beginStartAndWait(vm.resourceGroup, vm.vmName);
  console.log(result_start);
  return result_start;
}

export async function deleteVirtualMachine(vm) {
  console.log("\nDelete Confidential VM: " + vm.vmName);
  const result_start = await computeClient.virtualMachines.beginDeleteAndWait(vm.resourceGroup, vm.vmName);
  console.log(result_start);
  return result_start;
}



export async function createAndDeployVm(vm){
  console.log('vm:  ', vm);
  let resourceGroupName =  vm.resourceGroup;
  let vmName = vm.vmName;
  let vnetName = `${vmName}-vnet`
  let subnetName = `${vmName}-subnet`
  let publicIPName = `${vmName}-pip`;
  let networkInterfaceName = `${vmName}-nic`;
  let ipConfigName = `${vmName}-crpip`;
  let location = vm.region;
  let vnetInfo =  await createVnet(vnetName, subnetName, resourceGroupName, location);
  console.log('\n\nvnetInfo: ',vnetInfo);
  let subnetInfo = await getSubnetInfo(subnetName, resourceGroupName, vnetName);
  console.log('\n\nsubnetInfo: ',subnetInfo);
  let publicIPInfo = await createPublicIP(publicIPName, resourceGroupName, location);
  //store the publicIpInfo.ipAddress
  console.log('\n\npublicIPInfo: ',publicIPInfo);
  let nsgId = `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/`;
  let imageReference ={ 
    publisher: 'Canonical', 
    offer: '0001-com-ubuntu-confidential-vm-jammy', 
    sku: '22_04-lts-cvm', 
    version: 'latest' 
  };

  if( vm.osImageId === 'id1') {
    nsgId = nsgId +  `${resourceGroupName}-windows-nsg`;
    imageReference ={ 
      publisher: 'MicrosoftWindowsDesktop', 
      offer: 'Windows-11', 
      sku: 'win11-22h2-pro', 
      version: 'latest' 
    };
  } else {
    nsgId = nsgId +  `${resourceGroupName}-linux-nsg`;
  }
  let nicInfo = await createNIC(subnetInfo, publicIPInfo, ipConfigName, resourceGroupName, networkInterfaceName, nsgId, location);
  console.log('\n\nNIC created: ', nicInfo);
  //vmImageInfo = await findVMImage();
  let vmResult = await createVMWithSecurity(vmName, location, nicInfo, imageReference, resourceGroupName);
  return {
    publicIPInfo,
    nicInfo,
    vmResult
  }
}

async function createVMWithSecurity(vmName, location, nicInfo, imageReference, resourceGroupName) {
    

  //const nId = `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkInterfaces/${niceName}`;
  console.log("\n5.Creating Confidential VM: " + vmName);
  const parameters = {
    hardwareProfile: { vmSize: "Standard_DC2as_v5" },
    location: location,
    networkProfile: {
      networkInterfaces: [
        {
          id: nicInfo.id,
          primary: true,
        },
      ],
    },
    osProfile: {
      adminPassword: "azureuUser!123",
      adminUsername: "azureuser",
      computerName: vmName,
    },
    securityProfile: {
      securityType: "ConfidentialVM",
      uefiSettings: { secureBootEnabled: true, vTpmEnabled: true },
    },
    storageProfile: {
      //imageReference: { publisher: 'MicrosoftWindowsServer', offer: 'WindowsServer', sku: '2022-datacenter-azure-edition-hotpatch', version: 'latest' },
      imageReference: imageReference,
      osDisk: { 
            name: vmName + '-disk', createOption: 'FromImage',
            managedDisk: {
                      securityProfile: {
                      securityEncryptionType: "DiskWithVMGuestState",
                      },
                      storageAccountType: "StandardSSD_LRS",
                  }, }
    }
  };

  let vmresult = await computeClient.virtualMachines.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vmName,
    parameters,
  );
  console.log('VM Created:', vmresult);
  //console.log(vmresult);
}
async function createVnet(vnetName, subnetName, resourceGroupName, location) {
  console.log("\n1.Creating vnet: " + vnetName);
  const vnetParameters = {
    location: location,
    addressSpace: {
      addressPrefixes: ["10.0.0.0/16"],
    },
    dhcpOptions: {
      dnsServers: ["10.1.1.1", "10.1.2.4"],
    },
    subnets: [{ name: subnetName, addressPrefix: "10.0.0.0/24" }],
  };
  return await networkClient.virtualNetworks.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vnetName,
    vnetParameters
  );
}

async function getSubnetInfo(subnetName, resourceGroupName, vnetName) {
  console.log("\nGetting subnet info for: " + subnetName);
  const getResult = await networkClient.subnets.get(
    resourceGroupName,
    vnetName,
    subnetName
  );
  return getResult;
}

async function createPublicIP(publicIPName, resourceGroupName, location) {
  console.log("\n4.Creating public IP: " + publicIPName);
  const publicIPParameters = {
    location: location,
    publicIPAllocationMethod: "Static",
  };
  return await networkClient.publicIPAddresses.beginCreateOrUpdateAndWait(
    resourceGroupName,
    publicIPName,
    publicIPParameters
  );
}

async function createNIC(subnetInfo, publicIPInfo, ipConfigName, resourceGroupName, networkInterfaceName, nsgId, location) {
  console.log("\n5.Creating Network Interface: " + networkInterfaceName);
  const nicParameters = {
    location: location,
    ipConfigurations: [
      {
        name: ipConfigName,
        privateIPAllocationMethod: "Dynamic",
        subnet: subnetInfo,
        publicIPAddress: publicIPInfo,
      },
    ],
    networkSecurityGroup : {
      id: nsgId
    }
  };
  return await networkClient.networkInterfaces.beginCreateOrUpdateAndWait(
    resourceGroupName,
    networkInterfaceName,
    nicParameters
  );
}