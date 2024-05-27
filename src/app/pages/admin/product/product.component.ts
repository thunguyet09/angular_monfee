import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { API } from 'src/app/api/api.service';
import { Category } from 'src/app/models/Category';
import { Product } from 'src/app/models/Product';
import { Theme } from 'src/app/models/Theme';
import { ThemeService } from 'src/app/services/theme.service';
import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';
import { Router } from '@angular/router';
import { SaveIdService } from 'src/app/services/saveId.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements AfterViewInit {
  constructor(private themeService: ThemeService,
    private api: API,
    private dialog: MatDialog,
    private router: Router,
    private saveIdService: SaveIdService) { }
  public themes: Theme[] = [];
  public products: Product[] = []
  public categories: Category[] = []
  public total_pages = 0;
  public max_price = 0;
  ngOnInit() {
    const range = document.querySelector('.range-slider > input') as HTMLInputElement
    range.max = '200000';
    this.themeService.getTheme().subscribe((data: any) => {
      this.themes = data;
      this.themes.forEach((item) => {
        const addBtn = document.querySelector('.add-btn') as HTMLElement;
        addBtn.style.backgroundColor = item.color;
      });
    });


    this.getApiProducts('1')
    this.getApiCategories()
  }

  getApiProducts(page: any) {
    const page_showing = document.querySelector('.page-showing') as HTMLElement
    const published_products = document.querySelector('.publish-products > span') as HTMLElement
    const scheduled_products = document.querySelector('.schedule-products > span') as HTMLElement
    const draft_products = document.querySelector('.draft > span') as HTMLElement
    this.api.productPagination(page, '6').subscribe((data: any) => {
      this.products = data.products
      const published = data.all_products.filter((item:any) => item.status == 'published')
      published_products.textContent = published.length
      const scheduled = data.all_products.filter((item:any) => item.status == 'scheduled')
      scheduled_products.textContent = scheduled.length
      const draft = data.all_products.filter((item:any) => item.status == 'draft')
      draft_products.textContent = draft.length
      this.total_pages = data.totalPages
      if(data.endIndex > data.productLength){
        page_showing.innerHTML = `<span>Showing <b>${data.startIndex + 1}</b> to <b>${data.productLength}</b> of <b>${data.productLength}</b> results </span>`
      }else{
        page_showing.innerHTML = `<span>Showing <b>${data.startIndex + 1}</b> to <b>${data.endIndex}</b> of <b>${data.productLength}</b> results </span>`
      }

      const pagination = document.querySelector('.pagination') as HTMLElement;

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
        button.style.fontWeight = '550'
        button.style.fontSize = '14px'
        button.textContent = i.toString();
        pagination.appendChild(button);

        button.addEventListener('click', (event: Event) => {
          const target = event.target as HTMLElement;
          const pageNumber = target.textContent;
          if (pageNumber) {
            this.getApiProducts(pageNumber)
          }
        });
      }
      this.products.forEach((item: any) => {
        this.max_price = Math.max(...item.price)
      })
      this.maxRange(this.max_price)
    })
  }

  getApiCategories() {
    this.api.getAllCategories().subscribe((data: any) => {
      this.categories = data
      this.calculateProductCounts()
    })
  }
  calculateProductCounts(): void {
    const elementCounts: Record<number, number> = {};

    this.products.forEach((prod) => {
      const category = this.categories.find((cat) => cat.id === prod.cat_id);
      if (category) {
        const element = category.id;
        if (elementCounts[element] === undefined) {
          elementCounts[element] = 0;
        }
        elementCounts[element]++;
      }
    });

    const categoryLength: any[] = [];
    this.categories.forEach((cat) => {
      if (elementCounts[cat.id] !== undefined) {
        categoryLength.push({ id: cat.id, name: cat.name, length: elementCounts[cat.id] });
      }
    });

    const categories_list = document.querySelector('.categories-list') as HTMLElement
    categoryLength.forEach((item) => {
      const categories_item = document.createElement('div') as HTMLElement
      categories_item.style.display = 'flex'
      categories_item.style.flexDirection = 'row'
      categories_item.style.justifyContent = 'space-between'
      categories_item.style.alignItems = 'center'
      categories_item.style.margin = '5px 0px'
      categories_item.className = 'categories_item'
      const category_name = document.createElement('h5')
      category_name.style.fontSize = '16px'
      category_name.style.fontFamily = '"Nunito", sans-serif'
      category_name.style.fontWeight = '600'
      category_name.style.color = '#495057'
      category_name.textContent = item.name
      categories_item.appendChild(category_name)
      const category_length = document.createElement('button')
      category_length.style.backgroundColor = 'rgb(243, 246, 249)'
      category_length.style.color = '#878a99'
      category_length.style.fontWeight = 'bold'
      category_length.style.borderRadius = '5px'
      category_length.style.border = 'none'
      category_length.style.outline = 'none'
      category_length.style.padding = '3px 8px'
      category_length.textContent = item.length
      categories_item.appendChild(category_length)
      categories_list.appendChild(categories_item)
    })
  }
  getCategoryName(catId: number): string {
    const category = this.categories.find(c => c.id === catId);
    return category ? category.name : '';
  }

  isToggle = false;
  handleAction(event: Event) {
    const target = event.target as HTMLElement
    const parentNode = target.parentNode
    const childElement = parentNode?.childNodes[1] as HTMLElement
    this.isToggle = !this.isToggle
    if (this.isToggle) {
      childElement.style.display = 'block'
      childElement.classList.add('dropdown-animate')
    } else {
      childElement.style.display = 'none'
      childElement.classList.remove('dropdown-animate')
    }
  }

  handleActionChild(event: Event){
    event.stopPropagation()
    const target = event.target as HTMLElement
    const parentNode = target.parentNode
    const parentNode1 = parentNode?.parentNode
    console.log(parentNode1?.childNodes)
    const childElement = parentNode1?.childNodes[1] as HTMLElement
    this.isToggle = !this.isToggle
    if (this.isToggle) {
      childElement.style.display = 'block'
      childElement.classList.add('dropdown-animate')
    } else {
      childElement.style.display = 'none'
      childElement.classList.remove('dropdown-animate')
    }
  }

  ngAfterViewInit(): void {
  }

  maxRange(max_price: number) {
    const max_range = document.querySelector('.range-slider > input') as HTMLInputElement
    max_range.max = max_price.toString()
    const max = document.querySelector('.max_cost') as HTMLInputElement
    max.value = max_price.toString()
  }
  removeArr: number[] = [];

  handleCheckboxChange(id: number, checked: boolean): void {
    if (checked) {
      this.removeArr.push(id);
    } else {
      this.removeArr = this.removeArr.filter((itemId) => itemId !== id);
    }

    this.updateDeleteButtonState();
  }

  updateDeleteButtonState(): void {
    const numberSelect = document.querySelector('.number-select') as HTMLElement;
    const removeItem = document.querySelector('.select-remove') as HTMLElement;

    if (this.removeArr.length > 0) {
      removeItem.style.display = 'flex';
      numberSelect.innerHTML = `(${this.removeArr.length})`;
    } else {
      removeItem.style.display = 'none';
    }
  }

  handleDelete(): void {
    const deleteDialog = this.dialog.open(DeleteConfirmComponent, {
      exitAnimationDuration: '200ms',
      enterAnimationDuration: '200ms',
      data: {
        removeItems: this.removeArr,
      },
    });

    deleteDialog.afterClosed().subscribe((result) => {
      this.notifyParentAboutDeletion();
      this.removeArr = []
      this.updateDeleteButtonState()
    });
  }

  notifyParentAboutDeletion(): void {
    this.getApiProducts('1');
  }
  handleFilterPrice(event: Event) {
    const target = event.target as HTMLInputElement
    const max_cost = document.querySelector('.max_cost') as HTMLInputElement
    max_cost.value = target.value
    this.api.getAllProducts().subscribe((data: any) => {
      this.products = data.filter((item: any) => {
        return item.price[0] > 0 && item.price[0] <= target.value
      })
    })
  }

  minCost(event: Event) {
    const target = event.target as HTMLInputElement
    const max = document.querySelector('.max_cost') as HTMLInputElement
    this.api.getAllProducts().subscribe((data: any) => {
      this.products = data.filter((item: any) => {
        return item.price[0] > Number(target.value) && item.price[0] <= Number(max.value)
      })
    })
  }

  maxCost(event: Event) {
    const target = event.target as HTMLInputElement
    const min = document.querySelector('.min_cost') as HTMLInputElement
    this.api.getAllProducts().subscribe((data: any) => {
      this.products = data.filter((item: any) => {
        return item.price[0] > Number(min.value) && item.price[0] <= Number(target.value)
      })
    })
  }

  handleView(id: number) {
    localStorage.setItem('productId', id.toString())
  }

  slideIndex = 0;
  nextPage() {
    const pagination = document.querySelector('.pagination') as HTMLElement
    this.slideIndex = (this.slideIndex + 1) % (pagination.children.length);

    if (this.slideIndex >= 2) {
      this.slideIndex = 0;
      pagination.style.transform = `translateX(0)`
    } else {
      this.updateSliderPosition();
    }
  }

  prevPage() {
    const pagination = document.querySelector('.pagination') as HTMLElement
    if (this.slideIndex == 0) {
      this.slideIndex = 2;
      const slideWidth = pagination.clientWidth - 39;
      pagination.style.transform = `translateX(-${this.slideIndex * slideWidth}px)`;
    } else {
      this.slideIndex = (this.slideIndex - 1 + pagination.children.length) % pagination.children.length;
      this.updateSliderPosition();
    }
  }

  updateSliderPosition() {
    const pagination = document.querySelector('.pagination') as HTMLElement
    const slideWidth = pagination.clientWidth;
    pagination.style.transform = `translateX(-${this.slideIndex * slideWidth}px)`;
  }

  firstPage() {
    this.getApiProducts('1');
  }

  handleEdit(id: number){
    this.saveIdService.setProductId(id)
    this.router.navigate(['/admin/edit-product'])
  }
}
