import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { NytimesService } from './nytimes.service';

describe('NytimesService', () => {
  let service: NytimesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Tambahkan HttpClientModule di sini
    });
    service = TestBed.inject(NytimesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
