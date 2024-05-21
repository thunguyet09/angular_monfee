import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { API } from 'src/app/api/api.service';
import { Category } from 'src/app/models/Category';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements AfterViewInit{
  addForm!: FormGroup;
  public categories: Category[] = []
  public products: Product[] = []
  public id = localStorage.getItem('productId')
  public data: any[] = []
  public colorsArr: string[] = []
  public status = ''
  constructor(private api: API, private router: Router) { }
  public categoryId: number = 0;
  ngOnInit() {
    this.initializeForm()
    this.getCategories()
    this.getProducts()
    const img = document.querySelector('.imgBox > img') as HTMLImageElement
    const scheduled_status = document.querySelector('.schedule-status > input') as HTMLInputElement
    this.api.getDetail(this.id).subscribe((data: any) => {
      this.data = [data]
      this.colorsArr = data.colors
      this.sizes = data.sizes
      this.prices = data.price
      this.quantities = data.quantity
      this.status = data.status
      this.categoryId = data.cat_id
      if(this.status == 'scheduled'){
        scheduled_status.disabled = false;
      }
      img.src = `./assets/img/${data.img_url[0]}`
      this.addForm.patchValue({
        'name': data.name,
        'mo_ta': data.mo_ta,
        'gia_nhap': data.gia_nhap,
        'sizes': data.sizes
      })
      console.log(this.addForm.value)
    })
  }

  getCategories(){
    this.api.getAllCategories().subscribe((data: any) => {
      this.categories = data
    })
  }

  getProducts(){
    let index = 0;
    this.api.getAllProducts().subscribe((data: any) => {
      this.products = data
      index = data[data.length - 1].id + 1
      this.addForm.patchValue({
        'id': index
      })
    })
  }

  initializeForm() {
    this.addForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      createdAt: new FormControl(''),
      date_modified: new FormControl(''),
      status: new FormControl('', Validators.required),
      stock: new FormControl('In Stock'),
      img_url: new FormControl(''),
      colors: new FormControl('', Validators.required),
      sizes: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      cat_id: new FormControl('', Validators.required),
      gia_nhap: new FormControl('', Validators.required),
      promo_price: new FormControl(0),
      mo_ta: new FormControl(''),
      quantity: new FormControl(''),
      sales: new FormControl(0),
      likes: new FormControl(0)
    });
  }

  public image: string[] = []
  chooseImgMain(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const img = document.querySelector('.imgBox > img') as HTMLImageElement
    if (file) {
      this.image[0] = file.name
      this.addForm.patchValue({
        'img_url': this.image
      });
      img.src = `./assets/img/${file.name}`
    } else {
      this.image[0] = 'img.jpg'
      this.addForm.patchValue({
        'img_url': this.image
      });
    }
  }

  sizes: string[] = []
  prices: number[] = []
  quantities: number[] = []
  colors: string[] = []

  addSize() {
    const sizesInput = document.querySelector('.sizes-input') as HTMLElement;
    const size = document.createElement('input');
    size.classList.add('size-input');
    size.style.width = '100px';
    size.style.padding = '8px 5px';
    size.style.borderRadius = '5px';
    size.style.border = '1px solid rgb(197, 197, 197)';
    size.style.outline = 'none';
    size.type = 'text';
    sizesInput.appendChild(size);

    size.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const existingSize = this.sizes.find((item) => item === target.value);
      if (!existingSize) {
        this.sizes.push(target.value);
        sizesInput.removeChild(size)
      }
    });
  }

  addColor(){
    const colors_input = document.querySelector('.colors-input') as HTMLElement
    const color = document.createElement('input')
    color.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement
      this.colors.push(target.value)
      this.addForm.patchValue({
        'colors': this.colors
      })
    })
    color.style.width = '100px'
    color.style.padding = '8px 5px'
    color.style.borderRadius = '5px'
    color.style.border = 'none'
    color.style.outline = 'none'
    color.style.border = '1px solid rgb(197, 197, 197)'
    color.type = 'text'
    colors_input.appendChild(color)
  }

  inputColor(event: Event){
    const target = event.target as HTMLInputElement
    this.colors.push(target.value)
    this.addForm.patchValue({
      'colors': this.colors
    })
  }

  inputSize(event: Event) {
    const target = event.target as HTMLInputElement
    this.sizes.push(target.value.trim())
    this.addForm.patchValue({
      'sizes': this.sizes
    })
    console.log(this.addForm.value)
  }

  ngAfterViewInit(): void {
  }

  inputPrice(event: Event, index:number){
    const target = event.target as HTMLInputElement
    this.prices[index] = +target.value
    if(this.prices.length > 0){
      this.addForm.patchValue({
        'price': this.prices
      })
    }
  }

  inputQuantity(event: Event, index:number){
    const target = event.target as HTMLInputElement
    this.quantities[index] = +target.value
    if(this.quantities.length > 0){
      this.addForm.patchValue({
        'quantity': this.quantities
      })
      console.log(this.addForm.value)
    }
  }

  selectCategory(event: Event){
    const target = event.target as HTMLInputElement
    this.addForm.patchValue({
      'cat_id': parseInt(target.value)
    })
  }

  handleSubmit(){
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
    this.addForm.patchValue({'date_modified': formatDate})

    if(this.addForm && this.addForm.valid){
      console.log(this.addForm.value)
    }
  }

  selectedStatus(event: Event){
    const scheduled_status = document.querySelector('.schedule-status > input') as HTMLInputElement
    const target = event.target as HTMLInputElement
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
    if(target.value == 'scheduled'){
      scheduled_status.disabled = false;
    }else{
      scheduled_status.disabled = true;
      this.addForm.patchValue({
        'createdAt': formatDate
      })
    }

    this.addForm.patchValue({'status': target.value})
  }

  handleRemoveSize(index:number){
    this.sizes.splice(index,1)
    this.addForm.patchValue({
      'sizes': this.sizes
    })
  }
}
