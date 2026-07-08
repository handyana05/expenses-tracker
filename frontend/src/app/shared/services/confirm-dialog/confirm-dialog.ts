import { inject, Service } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import * as ConfirmDialogComponent from '../../components/confirm-dialog/confirm-dialog';

@Service()
export class ConfirmDialog {
    private readonly dialog = inject(MatDialog);

    confirm(data: ConfirmDialogComponent.ConfirmDialogData): Observable<boolean> {
        return this.dialog
            .open(ConfirmDialogComponent.ConfirmDialog, {
                width: '420px',
                data,
            })
            .afterClosed();
    }
}
