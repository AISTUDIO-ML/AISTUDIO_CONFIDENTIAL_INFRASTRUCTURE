// src/vms/dto/create-vm.dto.ts

export class CreateVmDto {
    id: string;
    resourceGroup: string;
    vmName: string;
    region: string;
    vmSize: string;
    osImageName: string;
    osImageId: string;
    securityType: string;
    adminUsername: string;
    adminPasswordOrKey: string;
    authenticationType: string;
    status: string;
}
  