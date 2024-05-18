import { AfterViewInit, Component } from '@angular/core';
import { API } from 'src/app/api/api.service';
import { Category } from 'src/app/models/Category';
import { Product } from 'src/app/models/Product';
import { Theme } from 'src/app/models/Theme';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements AfterViewInit{
  constructor(private themeService: ThemeService, private api: API){}
  public themes: Theme[] = [];
  public products: Product[] = []
  public categories: Category[] = []
  public max_price = 0;
  ngOnInit(){
    const range = document.querySelector('.range-slider > input') as HTMLInputElement
    range.max = '200000';
    this.themeService.getTheme().subscribe((data: any) => {
      this.themes = data;
      this.themes.forEach((item) => {
        const addBtn = document.querySelector('.add-btn') as HTMLElement;
        addBtn.style.backgroundColor = item.color;
      });
    });


    this.getApiProducts()
    this.getApiCategories()
  }

  getApiProducts(){
    this.api.getAllProducts().subscribe((data: any) => {
      this.products = data
      data.forEach((item:any) => {
        this.max_price = Math.max(...item.price)
      })
      this.maxRange(this.max_price)
    })
  }

  getApiCategories(){
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

    const categoryLength:any[] = [];
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
  handleAction(event: Event){
    const target = event.target as HTMLElement
    const parentNode = target.parentNode
    const childElement = parentNode?.childNodes[1] as HTMLElement
    this.isToggle = !this.isToggle
    if(this.isToggle){
      childElement.style.display = 'block'
      childElement.classList.add('dropdown-animate')
    }else{
      childElement.style.display = 'none'
      childElement.classList.remove('dropdown-animate')
    }
  }

  ngAfterViewInit(): void {
  }

  maxRange(max_price: number){
    const max_range = document.querySelector('.range-slider > input') as HTMLInputElement
    max_range.max = max_price.toString()
    const max = document.querySelector('.max_cost') as HTMLInputElement
    max.value = max_price.toString()
  }
  public removeArr:number[] = []
  deleteChecked(id: number, checked: boolean){
    const number_select = document.querySelector('.number-select') as HTMLElement
    const removeItem = document.querySelector('.select-remove') as HTMLElement
    if(checked){
      this.removeArr.push(id)
    }else{
      const index = this.removeArr.indexOf(id);
      if (index !== -1) {
        this.removeArr.splice(index, 1);
      }
    }
    if(this.removeArr.length > 0){
      removeItem.style.display = 'flex'
      number_select.innerHTML = `(${this.removeArr.length})`
    }else{
      removeItem.style.display = 'none'
    }
  }

  handleFilterPrice(event: Event){
    const target = event.target as HTMLInputElement
    const max_cost = document.querySelector('.max_cost') as HTMLInputElement
    max_cost.value = target.value
    this.api.getAllProducts().subscribe((data: any) => {
      this.products = data.filter((item:any) => {
        return item.price[0] > 0 && item.price[0] <= target.value
      })
    })
  }

  minCost(event: Event){
    const target = event.target as HTMLInputElement
    const max = document.querySelector('.max_cost') as HTMLInputElement
    this.api.getAllProducts().subscribe((data: any) => {
      this.products = data.filter((item:any) => {
        return item.price[0] > Number(target.value) && item.price[0] <= Number(max.value)
      })
    })
  }

  maxCost(event: Event){
    const target = event.target as HTMLInputElement
    const min = document.querySelector('.min_cost') as HTMLInputElement
    this.api.getAllProducts().subscribe((data: any) => {
      this.products = data.filter((item:any) => {
        return item.price[0] > Number(min.value) && item.price[0] <= Number(target.value)
      })
    })
  }

  handleView(id: number){
    localStorage.setItem('productId', id.toString())
  }
}
