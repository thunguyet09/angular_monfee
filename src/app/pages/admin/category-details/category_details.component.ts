import { AfterViewInit, Component } from '@angular/core';
import { API } from 'src/app/api/api.service';
import { Category } from 'src/app/interfaces/Category';
import * as Dropzone from 'dropzone';
@Component({
  selector: 'app-category-details',
  templateUrl: './category_details.component.html',
  styleUrls: ['./category_details.component.css']
})
export class CategoryDetailsComponent implements AfterViewInit {
  constructor(private api: API){}

  public categories: Category[] = [];
  public id: string | null = localStorage.getItem('categoryId');

  ngOnInit() {
    if (this.id !== null) {
      this.api.getCategoryDetail(parseInt(this.id)).subscribe((data: any) => {
        this.categories = [data];
      });
    }
  }

  ngAfterViewInit(): void {
    const myDropzone = new Dropzone("#myDropzone", {
      url: "/your-upload-url",
      acceptedFiles: 'image/*',
      maxFiles: 1,
      init: function() {
        this.on("success", function(file, response) {
          console.log("File uploaded successfully!", file, response);

        });

        this.on("error", function(file, errorMessage) {
          console.log("Error uploading file", file, errorMessage);

        });
      }
    });
  }
}
