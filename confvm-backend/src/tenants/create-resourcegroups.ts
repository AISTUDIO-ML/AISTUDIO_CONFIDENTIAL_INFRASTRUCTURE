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

const windowsSecurityRules = [
  {
    name: "HTTP",
    access: "Allow",
    destinationAddressPrefix: "*",
    destinationPortRange: "80",
    direction: "Inbound",
    priority: 130,
    sourceAddressPrefix: "*",
    sourcePortRange: "*",
    protocol: "*",
  },
  {
      name: "RDP",
      access: "Allow",
      destinationAddressPrefix: "*",
      destinationPortRange: "3389",
      direction: "Inbound",
      priority: 110,
      sourceAddressPrefix: "*",
      sourcePortRange: "*",
      protocol: "*",
    },
];

const linuxSecurityRules = [
  {
    name: "HTTP",
    access: "Allow",
    destinationAddressPrefix: "*",
    destinationPortRange: "80",
    direction: "Inbound",
    priority: 130,
    sourceAddressPrefix: "*",
    sourcePortRange: "*",
    protocol: "*",
  },
  {
      name: "SSH",
      access: "Allow",
      destinationAddressPrefix: "*",
      destinationPortRange: "22",
      direction: "Inbound",
      priority: 110,
      sourceAddressPrefix: "*",
      sourcePortRange: "*",
      protocol: "*",
    },
];

export async function createResourceGroup(tenantName, resourceGroup, region) {

    console.log("\n1.Creating resource group: " + resourceGroup);
    const groupParameters = {
      location: region,
    };
    const resCreate = await resourceClient.resourceGroups.createOrUpdate(
      resourceGroup,
      groupParameters
    );
    //console.log('resource response: ', resCreate);
    return resCreate;
}

export async function deleteResourceGroup(resourceGroup) {

  console.log("\n1.Deleting resource group: " + resourceGroup);

  const resDelete = await resourceClient.resourceGroups.beginDeleteAndWait(
    resourceGroup   
  );
  console.log('resource response: ', resDelete);
  return resDelete;
}

export async function listAllResourcesForThisResouceGroup(resourceGroup) {

  console.log("\n1.Listing resource group: " + resourceGroup);

  const resultArray = [];
  for await (const item of resourceClient.resources.listByResourceGroup(
    resourceGroup
  )) {
    resultArray.push(item);
  }
  console.log(resultArray);
  return resultArray;
}

export async function createNetworkSecurityGroupWithRules(resourceGroup, region) {
  
  let windowsnsg = resourceGroup + '-windows-nsg';
  let linuxnsg = resourceGroup + '-linux-nsg';
  console.log("\n1.Creating NetworkSecurityGroups windowsnsg: " + windowsnsg);
  const parameters = {
    location: region,
    securityRules: windowsSecurityRules,
  };
  let windNsgInfo = await networkClient.networkSecurityGroups.beginCreateOrUpdateAndWait(
    resourceGroup,
    windowsnsg,
    parameters,
  );
  //console.log(nsgInfo);
  //console.log('Created windNsgInfo : ', windNsgInfo);

  console.log("\n2.Creating NetworkSecurityGroups linuxnsg: " + linuxnsg);
  const parametersL = {
    location: region,
    securityRules: linuxSecurityRules,
  };
  let linuxNsgInfo = await networkClient.networkSecurityGroups.beginCreateOrUpdateAndWait(
    resourceGroup,
    linuxnsg,
    parametersL,
  );
  //console.log(nsgInfo);
  //console.log('Created linuxNsgInfo : ', linuxNsgInfo);
  return {windNsgInfo, linuxNsgInfo};
}