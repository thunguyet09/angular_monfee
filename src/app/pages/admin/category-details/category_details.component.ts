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
  constructor(private api: API){
    this.categoryForm = new FormGroup({
      'categoryName': new FormControl(''),
      'date_added': new FormControl(''),
      'date_modified': new FormControl(''),
      'top': new FormControl(''),
      'status': new FormControl(''),
      'image': new FormControl('')
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

}
