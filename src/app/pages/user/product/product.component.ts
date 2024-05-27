import { Component } from '@angular/core';
import { API } from 'src/app/api/api.service';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  constructor(private api: API) { }
  public uniqueColors = []
  public uniqueSizes = []
  public products: Product[] = []
  public page = 1;
  public pagination: Product[] = []
  ngOnInit() {
    this.handleCollection()
    this.api.getAllProducts().subscribe((data: any) => {
      this.products = data
    })
    this.api.getAllProducts().subscribe((data: any) => {
      const uniqueColors = data.reduce((colorSet: any, item: any) => {
        item.colors.forEach((color: string) => colorSet.add(color));
        return colorSet;
      }, new Set())
      this.uniqueColors = uniqueColors
      const uniqueSizes = data.reduce((sizeSet: any, item: any) => {
        item.sizes.forEach((color: string) => sizeSet.add(color));
        return sizeSet;
      }, new Set())
      this.uniqueSizes = uniqueSizes
    })

    this.api.productPagination(1,12).subscribe((res:any) => {
      this.pagination = res.products
    })
    this.onPriceFilter()
  }
  handleCollection() {
    const cate_collection = document.querySelector('.cate_collection') as HTMLElement
    const prevBtn = document.querySelector('.prevBtn') as HTMLElement
    const nextBtn = document.querySelector('.nextBtn') as HTMLElement
    cate_collection.addEventListener('mouseenter', () => {
      prevBtn.style.display = 'block';
      nextBtn.style.display = 'block';
      prevBtn.style.animation = '.toLeft 1s ease forwards';
      nextBtn.style.animation = '.toRight 1s ease forwards';
      prevBtn.classList.remove('prevBtnMouseLeave')
      nextBtn.classList.remove('nextBtnMouseLeave')
    })

    cate_collection.addEventListener('mouseleave', () => {
      prevBtn.classList.add('prevBtnMouseLeave')
      nextBtn.classList.add('nextBtnMouseLeave')
    })
  }

  onPriceFilter() {
    const items_per_page = localStorage.getItem('items_per_page')
    const product_items = document.querySelector('.product_grid_parent') as HTMLElement
    const price_list = document.querySelector('.list_price') as HTMLElement
    const filter_price = document.querySelector('.filter_price') as HTMLElement
    price_list.innerHTML = ''
    filter_price.innerHTML = ''
    const minPrice = this.products.reduce((min, product) => {
      const price = product.price[0]
      return price < min ? price : min;
    }, Infinity);

    const price_list_v1 = document.createElement('li')
    const price_v1 = minPrice + 80000
    price_list_v1.innerHTML = `<a>${minPrice.toLocaleString()} - ${price_v1.toLocaleString()}</a>`
    filter_price.appendChild(price_list_v1)
    price_list_v1.addEventListener('click', () => {
      this.api.productPagination(this.page, items_per_page).subscribe(
        (response) => {
          let filteredProducts: any[] = [];
          if (Array.isArray(response)) {
            filteredProducts = response.filter((val) => {
              if (val.promo_price && val.promo_price[0] > 0) {
                return val.promo_price[0] >= minPrice && val.promo_price[0] <= price_v1;
              } else {
                return val.price[0] >= minPrice && val.price[0] <= price_v1;
              }
            });
          }
          product_items.style.justifyContent = 'flex-start';
          product_items.style.columnGap = '25px';
          product_items.innerHTML = '';
          this.pagination = filteredProducts;
        }
      );
    });
    price_list.appendChild(price_list_v1)
    const price_list_v2 = document.createElement('li')
    const price_v2 = price_v1 + 80000
    price_list_v2.innerHTML = `<a>${price_v1.toLocaleString()} - ${price_v2.toLocaleString()}</a>`
    filter_price.appendChild(price_list_v2)
    price_list_v2.addEventListener('click', () => {
      this.api.productPagination(this.page, items_per_page).subscribe(
        (response) => {
          let filteredProducts: any[] = [];
          if (Array.isArray(response)) {
            filteredProducts = response.filter((val) => {
              if (val.promo_price && val.promo_price[0] > 0) {
                return val.promo_price[0] >= price_v1 && val.promo_price[0] <= price_v2;
              } else {
                return val.price[0] > price_v1 && val.price[0] <= price_v2;
              }
            });
          }
          product_items.style.justifyContent = 'flex-start';
          product_items.style.columnGap = '25px';
          product_items.innerHTML = '';
          this.pagination = filteredProducts;
        }
      );
    });
    price_list.appendChild(price_list_v2)
    const price_list_v3 = document.createElement('li')
    const price_v3 = price_v2 + 80000
    price_list_v3.innerHTML = `<a>${price_v2.toLocaleString()} - ${price_v3.toLocaleString()}</a>`
    filter_price.appendChild(price_list_v3)
    price_list_v3.addEventListener('click', () => {
      this.api.productPagination(this.page, items_per_page).subscribe(
        (response) => {
          let filteredProducts: any[] = [];
          if (Array.isArray(response)) {
            filteredProducts = response.filter((val) => {
              if (val.promo_price && val.promo_price[0] > 0) {
                return val.promo_price[0] >= price_v2 && val.promo_price[0] <= price_v3;
              } else {
                return val.price[0] >= price_v2 && val.price[0] <= price_v2;
              }
            });
          }
          product_items.style.justifyContent = 'flex-start';
          product_items.style.columnGap = '25px';
          product_items.innerHTML = '';
          this.pagination = filteredProducts;
        }
      );
    });
    price_list.appendChild(price_list_v3)
    const price_list_v4 = document.createElement('li')
    const price_v4 = price_v3 + 80000
    price_list_v4.innerHTML = `<a>${price_v3.toLocaleString()} - ${price_v4.toLocaleString()}</a>`
    filter_price.appendChild(price_list_v4)
    price_list_v4.addEventListener('click', () => {
      this.api.productPagination(this.page, items_per_page).subscribe(
        (response) => {
          let filteredProducts: any[] = [];
          if (Array.isArray(response)) {
            filteredProducts = response.filter((val) => {
              if (val.promo_price && val.promo_price[0] > 0) {
                return val.promo_price[0] >= price_v3 && val.promo_price[0] <= price_v4;
              } else {
                return val.price[0] >= price_v3 && val.price[0] <= price_v4;
              }
            });
          }
          product_items.style.justifyContent = 'flex-start';
          product_items.style.columnGap = '25px';
          product_items.innerHTML = '';
          this.pagination = filteredProducts;
        }
      );
    });
    price_list.appendChild(price_list_v4)
    const price_list_v5 = document.createElement('li')
    price_list_v5.innerHTML = `<a>Over ${price_v4.toLocaleString()}</a>`
    filter_price.appendChild(price_list_v5)
    price_list_v5.addEventListener('click', () => {
      this.api.productPagination(this.page, items_per_page).subscribe(
        (response) => {
          let filteredProducts: any[] = [];
          if (Array.isArray(response)) {
            filteredProducts = response.filter((val) => {
              if (val.promo_price[0] > 0) {
                return val.promo_price[0] > price_v4;
              } else {
                return val.price[0] > price_v4;
              }
            });
          }
          product_items.style.justifyContent = 'flex-start';
          product_items.style.columnGap = '25px';
          product_items.innerHTML = '';
          this.pagination = filteredProducts;
        },
        (error) => {
          console.error(error);
        }
      );
    });
    price_list.appendChild(price_list_v5)
  }

}
