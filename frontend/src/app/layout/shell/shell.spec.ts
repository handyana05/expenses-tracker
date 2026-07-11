import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shell } from './shell';
import { API_URL } from '../../core/config/api.config';
import { provideRouter } from '@angular/router';

describe('Shell', () => {
  let component: Shell;
  let fixture: ComponentFixture<Shell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter([]),
        {
          provide: API_URL,
          useValue: 'https://localhost:7115/api',
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Shell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
