import { TestBed } from '@angular/core/testing';
import { ConfirmDialog } from './confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('ConfirmDialog', () => {
  let service: ConfirmDialog;

  const matDialogMock = {
    open: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    matDialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    });

    TestBed.configureTestingModule({
      providers: [
        ConfirmDialog,
        {
          provide: MatDialog,
          useValue: matDialogMock,
        },
      ],
    });

    service = TestBed.inject(ConfirmDialog);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should open confirmation dialog', () => {
    service
      .confirm({
        title: 'Delete item',
        message: 'Are you sure?',
      })
      .subscribe((result) => {
        expect(result).toBe(true);
      });

    expect(matDialogMock.open).toHaveBeenCalled();
  });
});
