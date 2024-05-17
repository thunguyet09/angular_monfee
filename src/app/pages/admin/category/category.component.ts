import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  NgZone,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { API } from 'src/app/api/api.service';
import { Category } from 'src/app/models/Category';
import { Theme } from 'src/app/models/Theme';
import { CategoryService } from 'src/app/services/category.service';
import { ThemeService } from 'src/app/services/theme.service';
import { AddComponent } from './add/add.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements AfterViewInit {
  constructor(
    private dialog: MatDialog,
    private themeService: ThemeService,
    private api: API,
    private router: Router,
    private CategoryService: CategoryService,
    private ngZone: NgZone
  ) { }
  public themes: Theme[] = [];
  public bgColor: string = '';
  public categories: Category[] = [];
  public data: Category[] = []
  total_pages = 0;
  startIndex = 0;
  endIndex = 0;
  categoriesLength = 0
  ngOnInit() {
    this.themeService.getTheme().subscribe((data: any) => {
      this.themes = data;
      this.themes.forEach((item) => {
        const addBtn = document.querySelector('.add') as HTMLElement;
        addBtn.style.backgroundColor = item.color;
        this.bgColor = item.color;
      });
    });

    this.api.getAllCategories().subscribe((data: any) => {
      this.data = data
    })


    this.getAPI('1');
  }

  getAPI(page: string) {
    this.api.getCategoryPagination(page, '1').subscribe((data: any) => {
      this.categories = data.categories;
      this.startIndex = data.startIndex
      this.endIndex = data.endIndex
      this.categoriesLength = data.categoryLength
      this.total_pages = data.totalPages
      const pagination = document.querySelector('.pagination') as HTMLElement;
      const page_number = document.querySelector('.page-number > p') as HTMLElement;

      pagination.innerHTML = '';

      for (let i = 1; i <= this.total_pages; i++) {
        const button = document.createElement('button');

        button.addEventListener('mouseenter', () => {
          button.style.backgroundColor = '#1e91cf';
          button.style.color = 'white';
        });

        button.addEventListener('mouseleave', () => {
          button.style.backgroundColor = 'white';
          button.style.color = '#1e91cf';
        });

        button.style.backgroundColor = 'white';
        button.style.color = '#1e91cf';
        button.style.border = '1px solid rgb(217, 217, 217)';
        button.style.padding = '0px 15px';
        button.style.height = '40px';
        button.style.display = 'flex';
        button.style.justifyContent = 'center';
        button.style.alignItems = 'center';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.textContent = i.toString();
        pagination.appendChild(button);

        button.addEventListener('click', (event: Event) => {
          const target = event.target as HTMLElement;
          const pageNumber = target.textContent;
          if (pageNumber) {
            this.getAPI(pageNumber);
          }
        });
      }

      const pagesText =
        this.total_pages > 1
          ? `(${this.total_pages} Pages)`
          : `(1 Page)`;

      page_number.innerHTML = `Showing ${this.startIndex + 1} to ${this.endIndex == 0 ? 1 : this.endIndex} of ${this.categoriesLength} ${pagesText}`;
    });

    const prev_page = document.querySelector('.prev-page-btn') as HTMLElement
    const first_page = document.querySelector('.first-page-btn') as HTMLElement
    const next_page = document.querySelector('.next-page-btn') as HTMLElement;
    const last_page = document.querySelector('.last-page-btn') as HTMLElement;
    if (page == '1') {
      prev_page.style.display = 'none'
      first_page.style.display = 'none'
    } else {
      prev_page.style.display = 'block'
      first_page.style.display = 'block'
    }

    if(Number(page) < Number(this.total_pages)){
      next_page.style.display = 'block'
      last_page.style.display = 'block'
    }

    if (page == this.total_pages.toString()) {
      next_page.style.display = 'none'
      last_page.style.display = 'none'
    }

    last_page.addEventListener('click', () => {
      page = this.total_pages.toString()
      this.getAPI(this.total_pages.toString())
    })
  }
  hoverAddBtn(event: Event) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = 'black';
    target.style.color = 'white';
  }

  leaveAddBtn(event: Event) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = this.bgColor;
    target.style.color = 'black';
  }

  public ID: number = 0;
  public category_name: string = '';
  public date_value: string = '';
  public top: string = '';
  public status: string = '';

  ngAfterViewInit(): void {
    const filter_inputs = document.querySelectorAll<HTMLElement>('.row > input');
    const filter_selects = document.querySelectorAll<HTMLElement>('.row > select');
    filter_inputs.forEach((item) => {
      item.addEventListener('mouseleave', () => {
        item.style.borderColor = '#66afe9';
        item.style.boxShadow =
          'inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, 0.6)';
      });
      document.addEventListener('click', () => {
        item.style.borderColor = 'rgb(210, 210, 210)';
        item.style.boxShadow = 'none';
      });
    });

    filter_selects.forEach((item) => {
      item.addEventListener('mouseleave', () => {
        item.style.borderColor = '#66afe9';
        item.style.boxShadow =
          'inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, 0.6)';
      });
      document.addEventListener('click', () => {
        item.style.borderColor = 'rgb(210, 210, 210)';
        item.style.boxShadow = 'none';
      });
    });
  }

  public isToggle = false;
  handleFilter() {
    const filterContainer = document.querySelector(
      '.filter-container'
    ) as HTMLElement;
    this.isToggle = !this.isToggle;
    if (this.isToggle) {
      filterContainer.style.display = 'block';
      filterContainer.classList.add('appear');
    } else {
      filterContainer.style.display = 'none';
      filterContainer.classList.remove('appear');
    }
  }

  handleClear() {
    const id_input = document.querySelector('.ID_filter') as HTMLInputElement;
    const category_name = document.querySelector(
      '.categoryName_filter'
    ) as HTMLInputElement;
    const date_value = document.querySelector(
      '.date_value'
    ) as HTMLInputElement;
    const top = document.querySelector('.top') as HTMLInputElement;
    const status = document.querySelector('.status') as HTMLInputElement;
    id_input.value = '';
    category_name.value = '';
    date_value.value = '';
    top.value = '';
    status.value = '';
  }

  public searchData: Category[] = [];
  handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    const filteredData = this.categories.filter((item) =>
      item.name.toLowerCase().includes(target.value.toLowerCase())
    );
    this.searchData = filteredData;
    this.categories = filteredData;
    if (target.value == '') {
      this.searchData = [];
      this.getAPI('1');
    }
  }

  handleView(id: number) {
    localStorage.setItem('categoryId', id.toString());
    this.CategoryService.setView(true);
  }

  handleEdit(id: number) {
    localStorage.setItem('categoryId', id.toString());
    this.CategoryService.setView(false);
  }

  handleAdd() {
    const addDialog = this.dialog.open(AddComponent, {
      exitAnimationDuration: '200ms',
      enterAnimationDuration: '200ms',
    });

    addDialog.afterClosed().subscribe((result) => {
      this.getAPI('1');
    });
  }

  public removeItems: number[] = [];
  deleteAll() { }

  checkedDelete(id: number, checked: boolean) {
    if (checked) {
      this.removeItems.push(id);
    } else {
      const index = this.removeItems.indexOf(id);
      if (index !== -1) {
        this.removeItems.splice(index, 1);
      }
    }
  }

  handleDelete() {
    const dialog_content = document.querySelector(
      '#dialog-content'
    ) as HTMLElement;
    const dialog_icon = document.querySelector(
      '#dialog-content > span'
    ) as HTMLElement;
    const dialog_text = document.querySelector('.dialog-text') as HTMLElement;
    if (this.removeItems.length > 0) {
      this.removeItems.forEach((item) => {
        this.api.deleteCategory(item).subscribe((res) => {
          dialog_content.style.display = 'flex';
          dialog_content.style.backgroundColor = '#FE7A36';
          dialog_icon.innerHTML = '<i class="fa-solid fa-check"></i>';
          dialog_text.textContent = 'Danh mục đã xóa thành công';

          setTimeout(() => {
            this.getAPI('1');
            dialog_content.style.display = 'none';
          }, 2000);
        });
      });
    }
  }

  handleFilter2() {
    const filteredCategories = [];
    const filterArr: any[] = [];
    filterArr.push(
      { id: this.ID },
      { name: this.category_name },
      { top: this.top },
      { status: this.status },
      { date_value: this.date_value }
    );
    const notEmptyItems: any[] = [];
    for (let i = 0; i < filterArr.length; i++) {
      const obj = filterArr[i];
      for (const key in obj) {
        const attributeName = key;
        const attributeValue = obj[key];
        if (attributeValue !== '') {
          notEmptyItems.push({ [attributeName]: attributeValue });
        }
      }
    }


    for (let i = 0; i < notEmptyItems.length; i++) {
      const obj = notEmptyItems[i];
      for (const key in obj) {
        const attributeValue = obj[key];
        if (typeof attributeValue === 'string') {
          const lowercaseValue = attributeValue.toLowerCase();
          const filteredData = this.categories.filter((item: any) =>
            item[key].toLowerCase().includes(lowercaseValue)
          );
          filteredCategories.push(...filteredData);
        }
        if (typeof attributeValue == 'number') {
          const filteredData = this.categories.filter(
            (item: any) => item[key] == attributeValue
          );
          filteredCategories.push(...filteredData);
        }
      }
    }

    this.categories = filteredCategories;

    if (filteredCategories.length === 0) {
      this.getAPI('1');
    }
  }

  handleSearchItem(event: Event) {
    const target = event.target as HTMLElement
    const item_name = target.textContent
    if (item_name !== null) {
      const filteredData = this.data.filter((item) =>
        item.name.toLowerCase().includes(item_name.toLowerCase())
      );
      this.categories = filteredData
    }
  }

  slideIndex = 0;
  nextPage() {
    const pagination = document.querySelector('.pagination') as HTMLElement
    this.slideIndex = (this.slideIndex + 1) % pagination.children.length;

    if(this.slideIndex > 2){
      this.slideIndex = 0;
      pagination.style.transform = `translateX(0px)`
    }else{
      this.updateSliderPosition();
    }
  }

  prevPage() {
    const pagination = document.querySelector('.pagination') as HTMLElement
    if(this.slideIndex == 0){
      this.slideIndex = 2;
      const slideWidth = pagination.clientWidth - 5;
      pagination.style.transform = `translateX(-${this.slideIndex * slideWidth}px)`;
    }else{
      this.slideIndex = (this.slideIndex - 1 + pagination.children.length) % pagination.children.length;
      this.updateSliderPosition();
    }
  }

  updateSliderPosition() {
    const pagination = document.querySelector('.pagination') as HTMLElement
    const slideWidth = pagination.clientWidth - 5;
    pagination.style.transform = `translateX(-${this.slideIndex * slideWidth}px)`;
  }

  firstPage(){
    this.getAPI('1');
  }
}
