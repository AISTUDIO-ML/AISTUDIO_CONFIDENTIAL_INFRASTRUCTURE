import { Test, TestingModule } from '@nestjs/testing';
import { VmsService } from './vms.service';

describe('VmsService', () => {
  let service: VmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VmsService],
    }).compile();

    service = module.get<VmsService>(VmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
