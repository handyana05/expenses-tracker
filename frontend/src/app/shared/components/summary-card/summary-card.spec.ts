import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryCard } from './summary-card';

describe('SummaryCard', () => {
  let component: SummaryCard;
  let fixture: ComponentFixture<SummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryCard);

    fixture.componentRef.setInput('title', 'Total Income');
    fixture.componentRef.setInput('value', 1234.56);
    fixture.componentRef.setInput('icon', 'payments');
    fixture.componentRef.setInput('tone', 'income');

    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Total Income');
  });

  it('should display the formatted value', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('1,234.56');
  });
});
