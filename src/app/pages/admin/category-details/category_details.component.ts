import { AfterViewInit, Component } from '@angular/core';
import { API } from 'src/app/api/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/interfaces/Category';
@Component({
  selector: 'app-category-details',
  templateUrl: './category_details.component.html',
  styleUrls: ['./category_details.component.css']
})
export class CategoryDetailsComponent {
  categoryForm!: FormGroup;
  isView:boolean = true;
  constructor(private api: API, private CategoryService: CategoryService){}

  public categories: Category[] = [];
  public id: string | null = localStorage.getItem('categoryId');

  ngOnInit() {
    this.CategoryService.getView().subscribe((data) => {
      this.isView = data;
      this.initializeForm()
    })
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
    if (this.id !== null) {
      this.api.getCategoryDetail(parseInt(this.id)).subscribe((data: any) => {
        this.categories = [data];
        this.categoryForm.controls['name'].patchValue(data.name);
        this.categoryForm.controls['date_added'].patchValue(data.date_added)
        this.categoryForm.controls['date_modified'].patchValue(formatDate)
        this.categoryForm.controls['image'].patchValue(data.image)
        this.categoryForm.controls['top'].patchValue(data.top)
        this.categoryForm.controls['status'].patchValue(data.status)
      });
    }
  }

  initializeForm() {
    this.categoryForm = new FormGroup({
      name: new FormControl({ value: '', disabled: this.isView }),
      date_added: new FormControl({ value: '', disabled: true }),
      date_modified: new FormControl({ value: '', disabled: true }),
      top: new FormControl({ value: '', disabled: this.isView }),
      status: new FormControl({ value: '', disabled: this.isView }),
      image: new FormControl({ value: '', disabled: this.isView })
    });
  }

  chooseImg(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const img = document.querySelector('.imgBox > img') as HTMLImageElement
    if (file) {
      this.categoryForm.patchValue({
        'image': file.name
      });
      img.src = `./assets/img/${file.name}`
    } else {
      this.categoryForm.patchValue({
        'image': ''
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

  editClick(){
    this.isView = !this.isView
    if(this.isView == false){
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.controls[key].enable();
      });

      this.categoryForm.controls['date_added'].disable();
      this.categoryForm.controls['date_modified'].disable();
    }else{
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.controls[key].disable();
      });
    }
  }

  handleUpdate(){
    this.categoryForm.controls['date_added'].enable();
    this.categoryForm.controls['date_modified'].enable();
    const dialog_content = document.querySelector('#dialog-content') as HTMLElement
    const dialog_icon = document.querySelector('#dialog-content > span') as HTMLElement
    const dialog_text = document.querySelector('.dialog-text') as HTMLElement
    if(this.id !== null){
      this.api.updateCategory(parseInt(this.id), this.categoryForm.value).subscribe((res) => {
        dialog_content.style.display = 'flex'
        dialog_content.style.backgroundColor = '#ABC270'
        dialog_icon.innerHTML = '<i class="fa-solid fa-check"></i>'
        dialog_text.textContent = 'Danh mục đã cập nhật thành công'
      })
      setTimeout(() => {
        document.location.href = '/admin/category'
      }, 2000)
    }
  }
}
