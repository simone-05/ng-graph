import { TestBed } from '@angular/core/testing';

import { GraphCreationService } from './graph-creation.service';

describe('GraphCreationService', () => {
  let service: GraphCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
