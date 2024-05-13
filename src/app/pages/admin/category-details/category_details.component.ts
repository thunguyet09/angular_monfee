import { AfterViewInit, Component } from '@angular/core';
import { API } from 'src/app/api/api.service';
import { Category } from 'src/app/interfaces/Category';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-category-details',
  templateUrl: './category_details.component.html',
  styleUrls: ['./category_details.component.css']
})
export class CategoryDetailsComponent {
  categoryForm: FormGroup;
  public isView:boolean = true;
  constructor(private api: API){
    this.categoryForm = new FormGroup({
      'categoryName': new FormControl({value: '', disabled: this.isView}),
      'date_added': new FormControl({value: '', disabled: this.isView}),
      'date_modified': new FormControl({value: '', disabled: this.isView}),
      'top': new FormControl({value: '', disabled: this.isView}),
      'status': new FormControl({value: '', disabled: this.isView}),
      'image': new FormControl({value: '', disabled: this.isView})
    })
  }

  public categories: Category[] = [];
  public id: string | null = localStorage.getItem('categoryId');

  ngOnInit() {
    if (this.id !== null) {
      this.api.getCategoryDetail(parseInt(this.id)).subscribe((data: any) => {
        this.categories = [data];
        this.categoryForm.controls['categoryName'].patchValue(data.name);
        this.categoryForm.controls['date_added'].patchValue(data.date_added)
        if(data.date_modified){
          this.categoryForm.controls['date_modified'].patchValue(data.date_modified)
        }else{
          this.categoryForm.controls['date_modified'].patchValue(data.date_added)
        }
      });
    }
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
    this.isView = !this.isView;
    if(this.isView == false){
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.controls[key].enable();
      });
    }else{
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.controls[key].disable();
      });
    }
  }
}
