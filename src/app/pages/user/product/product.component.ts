import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { API } from 'src/app/api/api.service';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  constructor(private api: API,
    private router: Router) { }
  public uniqueColors = []
  public uniqueSizes = []
  public products: Product[] = []
  public page = 1;
  public pagination: Product[] = []
  public items_per_page = localStorage.getItem('items_per_page')
  ngOnInit() {
    this.handleCollection()
    this.api.getAllProducts().subscribe((data: any) => {
      this.products = data
      this.onPriceFilter(data)
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

    this.api.productPagination(1, 12).subscribe((res: any) => {
      this.pagination = res.products
      this.handlePages(res.totalPages)
    })
    localStorage.setItem('items_per_page', '12')
  }

  getDiscountPercentage(promo_price: any, price: any): number {
    if (promo_price && promo_price.length > 0 && promo_price[0] > 0) {
      return 100 - Math.floor((promo_price[0] * 100) / price[0]);
    }
    return 0;
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

  onPriceFilter(products: any) {
    const product_items = document.querySelector('.product_grid_parent') as HTMLElement
    const price_list = document.querySelector('.list_price') as HTMLElement
    const filter_price = document.querySelector('.filter_price') as HTMLElement
    price_list.innerHTML = ''
    filter_price.innerHTML = ''
    const minPrice = products.reduce((min: any, product: any) => {
      const price = product.price[0]
      return price < min ? price : min;
    }, Infinity);

    const price_list_v1 = document.createElement('li')
    price_list_v1.style.listStyleType = 'none'
    price_list_v1.style.padding = '10px 0px'
    price_list_v1.style.fontFamily = '"Nunito", sans-serif'
    const price_v1 = minPrice + 80000
    price_list_v1.innerHTML = `<a>${minPrice.toLocaleString()} - ${price_v1.toLocaleString()}</a>`
    const price_list_a = price_list_v1.childNodes[0] as HTMLElement
    price_list_a.style.fontWeight = '600'
    price_list_a.style.fontSize = '16px'
    price_list_a.style.cursor = 'pointer'
    price_list_a.style.transition = '.2s ease'

    filter_price.appendChild(price_list_v1)
    price_list_v1.addEventListener('click', () => {
      if (this.items_per_page !== null) {
        this.api.productPagination(this.page, parseInt(this.items_per_page)).subscribe(
          (response) => {
            console.log(response)
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
      }
    });
    price_list.appendChild(price_list_v1)
    const price_list_v2 = document.createElement('li')
    price_list_v2.style.listStyleType = 'none'
    price_list_v2.style.padding = '10px 0px'
    price_list_v2.style.fontFamily = '"Nunito", sans-serif'
    const price_v2 = price_v1 + 80000
    price_list_v2.innerHTML = `<a>${price_v1.toLocaleString()} - ${price_v2.toLocaleString()}</a>`
    const price_list_a2 = price_list_v2.childNodes[0] as HTMLElement
    price_list_a2.style.fontWeight = '600'
    price_list_a2.style.fontSize = '16px'
    price_list_a2.style.cursor = 'pointer'
    price_list_a2.style.transition = '.2s ease'
    filter_price.appendChild(price_list_v2)
    price_list_v2.addEventListener('click', () => {
      if (this.items_per_page !== null) {
        this.api.productPagination(this.page, parseInt(this.items_per_page)).subscribe(
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
      }
    });
    price_list.appendChild(price_list_v2)
    const price_list_v3 = document.createElement('li')
    price_list_v3.style.listStyleType = 'none'
    price_list_v3.style.padding = '10px 0px'
    price_list_v3.style.fontFamily = '"Nunito", sans-serif'
    const price_v3 = price_v2 + 80000
    price_list_v3.innerHTML = `<a>${price_v2.toLocaleString()} - ${price_v3.toLocaleString()}</a>`
    const price_list_a3 = price_list_v3.childNodes[0] as HTMLElement
    price_list_a3.style.fontWeight = '600'
    price_list_a3.style.fontSize = '16px'
    price_list_a3.style.cursor = 'pointer'
    price_list_a3.style.transition = '.2s ease'
    filter_price.appendChild(price_list_v3)
    price_list_v3.addEventListener('click', () => {
      if (this.items_per_page !== null) {
        this.api.productPagination(this.page, parseInt(this.items_per_page)).subscribe(
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
      }
    });
    price_list.appendChild(price_list_v3)
    const price_list_v4 = document.createElement('li')
    price_list_v4.style.listStyleType = 'none'
    price_list_v4.style.padding = '10px 0px'
    price_list_v4.style.fontFamily = '"Nunito", sans-serif'
    const price_v4 = price_v3 + 80000
    price_list_v4.innerHTML = `<a>${price_v3.toLocaleString()} - ${price_v4.toLocaleString()}</a>`
    const price_list_a4 = price_list_v4.childNodes[0] as HTMLElement
    price_list_a4.style.fontWeight = '600'
    price_list_a4.style.fontSize = '16px'
    price_list_a4.style.cursor = 'pointer'
    price_list_a4.style.transition = '.2s ease'
    filter_price.appendChild(price_list_v4)
    price_list_v4.addEventListener('click', () => {
      if (this.items_per_page !== null) {
        this.api.productPagination(this.page, parseInt(this.items_per_page)).subscribe(
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
      }
    });
    price_list.appendChild(price_list_v4)
    const price_list_v5 = document.createElement('li')
    price_list_v5.style.listStyleType = 'none'
    price_list_v5.style.padding = '10px 0px'
    price_list_v5.style.fontFamily = '"Nunito", sans-serif'
    price_list_v5.innerHTML = `<a>Over ${price_v4.toLocaleString()}</a>`
    const price_list_a5 = price_list_v5.childNodes[0] as HTMLElement
    price_list_a5.style.fontWeight = '600'
    price_list_a5.style.fontSize = '16px'
    price_list_a5.style.cursor = 'pointer'
    price_list_a5.style.transition = '.2s ease'
    filter_price.appendChild(price_list_v5)
    price_list_v5.addEventListener('click', () => {
      if (this.items_per_page !== null) {
        this.api.productPagination(this.page, parseInt(this.items_per_page)).subscribe(
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
      }
    });
    price_list.appendChild(price_list_v5)
  }

  handleNavigation(id: number) {
    this.router.navigate([`/products/${id}`])
  }

  imgProductMouseEnter(event: Event) {
    const target = event.target as HTMLElement
    const img_product_arr = document.querySelectorAll('.img_product')
    img_product_arr.forEach((item) => {
      item.removeAttribute('id')
      const img_product_child1 = target.childNodes[1] as HTMLElement
      img_product_child1.style.display = 'flex'
      const parentNode = target.parentNode as HTMLElement
      const color_btns = parentNode?.querySelector('.product_colors') as HTMLElement
      if (color_btns) {
        setTimeout(() => {
          color_btns.style.display = 'flex'
          color_btns.setAttribute('id', 'animate_color')
        }, 900)
      }
    })
    target.setAttribute('id', 'img_product_after')
  }

  imgProductMouseLeave(event: Event) {
    const target = event.target as HTMLElement
    const parentNode = target.parentNode as HTMLElement
    const color_btns = parentNode?.querySelector('.product_colors') as HTMLElement
    if (color_btns) {
      color_btns.style.display = 'none'
    }
    const img_product_child1 = target.childNodes[1] as HTMLElement
    img_product_child1.style.display = 'none'
  }

  handlePages(totalPages: number) {
    const product_items = document.querySelector('.product_grid_parent') as HTMLElement
    const last_page = document.querySelector('.last_page') as HTMLElement
    const next_page = document.querySelector('.next_page') as HTMLElement
    const first_page = document.querySelector('.first_page') as HTMLElement
    const prev_page = document.querySelector('.prev_page') as HTMLElement

    const total_pages = document.querySelector('.total_pages') as HTMLElement
    total_pages.innerHTML = ''
    const filter_size = document.querySelectorAll('.filter_size > button')
    const list_size = document.querySelectorAll('.list_size > li > a')
    filter_size.forEach((item) => {
      item.addEventListener('click', async () => {
        if (this.items_per_page !== null) {
          this.api.productPagination(this.page, parseInt(this.items_per_page)).subscribe((data: any) => {
            const filteredData = data.products.filter((val: any) => {
              return val.sizes.includes(item.textContent)
            })
            product_items.style.justifyContent = 'flex-start'
            product_items.style.columnGap = '25px'
            product_items.innerHTML = ''
            this.pagination = filteredData
          })
        }
      })
    })
    list_size.forEach((item: any) => {
      item.addEventListener('click', async () => {
        if (this.items_per_page !== null) {
          this.api.productPagination(this.page, parseInt(this.items_per_page)).subscribe((data: any) => {
            const filteredData = data.products.filter((val: any) => {
              return val.sizes.includes(item.title)
            })
            product_items.style.justifyContent = 'flex-start'
            product_items.style.columnGap = '25px'
            product_items.innerHTML = ''
            this.pagination = filteredData
          })
        }
      })
    })

    next_page.addEventListener('click', async () => {
      const next_page_number = this.page + 1
      this.page = next_page_number;
      if (next_page_number > totalPages) {
        this.page = totalPages
        product_items.innerHTML = ''
        if (this.items_per_page !== null) {
          this.api.productPagination(totalPages, parseInt(this.items_per_page)).subscribe((data: any) => {
            this.pagination = data.products
          })
        }
      } else {
        total_pages.childNodes.forEach((p: any) => {
          p.removeAttribute('id');
        });

        const currentPage = Array.from(total_pages.childNodes).find((p: any) => parseInt(p.title) == next_page_number) as HTMLElement;
        if (currentPage) {
          currentPage.setAttribute('id', 'page_active');
          if (this.items_per_page !== null) {
            this.api.productPagination(next_page_number, parseInt(this.items_per_page)).subscribe((data: any) => {
              product_items.innerHTML = ''
              this.pagination = data.products
            })
          }
        }
        if (this.page == 1) {
          first_page.style.display = 'none'
          prev_page.style.display = 'none'
        } else {
          first_page.style.display = 'flex'
          prev_page.style.display = 'flex'
        }
      }
    })

    last_page.addEventListener('click', () => {
      if (this.items_per_page !== null) {
        this.api.productPagination(totalPages, parseInt(this.items_per_page)).subscribe((data: any) => {
          this.pagination = data.products
        })
      }
      total_pages.childNodes.forEach((p: any) => {
        p.removeAttribute('id');
      });

      const currentPage = Array.from(total_pages.childNodes).find((p: any) => parseInt(p.title) == totalPages) as HTMLElement;
      if (currentPage) {
        currentPage.setAttribute('id', 'page_active');
      }
      first_page.style.display = 'flex'
      prev_page.style.display = 'flex'
    })

    prev_page.addEventListener('click', async () => {
      const prev_page_number = this.page - 1
      this.page = prev_page_number;
      if (prev_page_number <= 1) {
        this.page = 1;
        total_pages.childNodes.forEach((p: any) => {
          p.removeAttribute('id');
        });

        const currentPage = Array.from(total_pages.childNodes).find((p: any) => parseInt(p.title) == 1) as HTMLElement;
        if (currentPage) {
          currentPage.setAttribute('id', 'page_active');
        }
        this.api.productPagination(1, this.items_per_page).subscribe((data: any) => {
          product_items.innerHTML = ''
          this.pagination = data.products
        })
      } else {
        total_pages.childNodes.forEach((p: any) => {
          p.removeAttribute('id');
        });

        const currentPage = Array.from(total_pages.childNodes).find((p: any) => parseInt(p.title) == prev_page_number) as HTMLElement;
        if (currentPage) {
          currentPage.setAttribute('id', 'page_active');
          if (this.items_per_page !== null) {
            this.api.productPagination(prev_page_number, this.items_per_page).subscribe((data: any) => {
              product_items.innerHTML = ''
              this.pagination = data.products
            })
          }
        }
        if (this.page == 1) {
          first_page.style.display = 'none'
          prev_page.style.display = 'none'
        } else {
          first_page.style.display = 'flex'
          prev_page.style.display = 'flex'
        }
      }
    })

    first_page.addEventListener('click', () => {
      product_items.innerHTML = ''
      this.api.productPagination(1, this.items_per_page).subscribe((data: any) => {
        this.pagination = data.products
      })
      total_pages.childNodes.forEach((p: any) => {
        p.removeAttribute('id');
      });

      const currentPage = Array.from(total_pages.childNodes).find((p: any) => parseInt(p.title) == 1) as HTMLElement;
      if (currentPage) {
        currentPage.setAttribute('id', 'page_active');
      }
      first_page.style.display = 'flex'
      prev_page.style.display = 'flex'
    })

    for (let i = 1; i <= totalPages; i++) {
      const page_link = document.createElement('a')
      page_link.style.fontFamily = '"Nunito", sans-serif'
      page_link.style.border = '1px solid rgb(216, 216, 216)'
      page_link.style.width = '45px'
      page_link.style.height = '45px'
      page_link.style.padding = '3px 4px'
      page_link.style.display = 'flex'
      page_link.style.justifyContent = 'center'
      page_link.style.alignItems = 'center'
      page_link.style.cursor = 'pointer'
      page_link.style.transition = '.3s ease'
      page_link.style.fontWeight = '600'
      page_link.title = `${i}`
      page_link.innerHTML = `0${i}`
      total_pages.appendChild(page_link)
      if (i == 1) {
          page_link.setAttribute('id', 'page_active')
      }

      page_link.addEventListener('click', () => {
          total_pages.childNodes.forEach((item:any) => {
              item.removeAttribute('id')
          })
          this.page = parseInt(page_link.title)
          if (this.page == 1) {
              first_page.style.display = 'none'
              prev_page.style.display = 'none'
          } else {
              first_page.style.display = 'flex'
              prev_page.style.display = 'flex'
          }
          page_link.setAttribute('id', 'page_active')
          setTimeout(async () => {
              product_items.innerHTML = ''
              if (this.items_per_page) {
                  this.api.productPagination(i, parseInt(this.items_per_page)).subscribe((data:any) => {
                    this.pagination = data.products
                  })

              } else {
                  product_items.innerHTML = ''
                  this.api.productPagination(i, 12).subscribe((data:any) => {
                    this.pagination = data.products
                  })
              }
          }, 200)
      })
  }

  }
}
