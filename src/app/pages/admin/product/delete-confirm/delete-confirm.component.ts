import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { API } from 'src/app/api/api.service';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css']
})
export class DeleteConfirmComponent {
  public removeItems: number[] = []
  constructor(public dialogRef: MatDialogRef<DeleteConfirmComponent>,
             @Inject(MAT_DIALOG_DATA) public data: any,
             private api: API)
  {
      this.removeItems = data.removeItems
  }

  handleDelete(){
    this.removeItems.forEach((item) => {
      this.api.deleteProduct(item).subscribe((data) => {
        this.dialogRef.close(null);
      })
    })
  }

  onClose(){
    this.dialogRef.close(null);
  }
}
