import { TestBed } from '@angular/core/testing';

import { GameSingleOutService } from './game-single-out.service';

describe('GameSingleOutService', () => {
  let service: GameSingleOutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSingleOutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
