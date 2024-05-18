import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { API } from 'src/app/api/api.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  addForm!: FormGroup;
  constructor(private api: API,
              public dialogRef: MatDialogRef<AddComponent>){}

  public categoryId:number = 0;
  ngOnInit(){
    this.initializeForm()
    this.api.getAllCategories().subscribe((data:any) => {
      this.categoryId = data[data.length - 1].id + 1
      this.addForm.patchValue({
        'id': this.categoryId
      });
      console.log(this.categoryId)
    })
  }
  initializeForm() {
    this.addForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      date_added: new FormControl(''),
      date_modified: new FormControl(''),
      top: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      image: new FormControl('img.jpg')
    });
  }


  chooseImg(event: Event){
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const img = document.querySelector('.imgBox > img') as HTMLImageElement
    if (file) {
      this.addForm.patchValue({
        'image': file.name
      });
      img.src = `./assets/img/${file.name}`
    } else {
      this.addForm.patchValue({
        'image': 'img.jpg'
      });
    }
  }

  handleTooltip(event: Event){
    const target = event.target as HTMLElement
    const targetParent = target.parentNode
    const targetParent2 = targetParent?.parentNode
    const tooltip = targetParent2?.childNodes[0] as HTMLElement
    tooltip.style.display = 'block'
  }

  leaveTooltip(event: Event){
    const target = event.target as HTMLElement
    const targetParent = target.parentNode
    const targetParent2 = targetParent?.parentNode
    const tooltip = targetParent2?.childNodes[0] as HTMLElement
    tooltip.style.display = 'none'
  }

  handleAdd(){
    const dialog_content = document.querySelector('#dialog-content') as HTMLElement
    const dialog_icon = document.querySelector('#dialog-content > span') as HTMLElement
    const dialog_text = document.querySelector('.dialog-text') as HTMLElement
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()
    const hour = currentDate.getHours()
    const minute = currentDate.getMinutes()
    let formatDate:string;
    if(minute < 10 && hour < 10){
        formatDate = year + '-' + month + '-' + day + " " + "0" + hour + ":" + "0" + minute
    }else if(hour < 10){
        formatDate = year + '-' + month + '-' + day + " " + "0"+ hour + ":" + minute
    }else if(minute < 10){
        formatDate = year + '-' + month + '-' + day  + " " + hour + ":" + "0" + minute
    }else{
        formatDate = year + "-" + month + "-" + day + " " + hour + ":" + minute
    }
    this.addForm.patchValue({'date_added': formatDate})
    this.addForm.patchValue({'date_modified': formatDate})
    if (this.addForm && this.addForm.valid) {
      this.api.addCategory(this.addForm.value).subscribe((res) => {
        dialog_content.style.display = 'flex'
        dialog_content.style.backgroundColor = '#FE7A36'
        dialog_icon.innerHTML = '<i class="fa-solid fa-check"></i>'
        dialog_text.textContent = 'Danh mục đã thêm thành công'

        setTimeout(() => {
          this.dialogRef.close(null);
          dialog_content.style.display = 'none'
        }, 2000)
      })
    }else{
      dialog_content.style.display = 'flex'
      dialog_content.style.backgroundColor = '#C5041B'
      dialog_icon.innerHTML = '<i class="fa-solid fa-xmark"></i>'
      dialog_text.textContent = 'Vui lòng nhập đầy đủ thông tin'
      setTimeout(() => {
        dialog_content.style.display = 'none'
      }, 1000)
    }
  }

  closeModal(){
    this.dialogRef.close(null);
    const dialog_content = document.querySelector('#dialog-content') as HTMLElement
    dialog_content.style.display = 'none'
  }
}
