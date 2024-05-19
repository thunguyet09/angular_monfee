import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { API } from 'src/app/api/api.service';
import { Category } from 'src/app/models/Category';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements AfterViewInit{
  addForm!: FormGroup;
  public categories: Category[] = []
  constructor(private api: API) { }

  public categoryId: number = 0;
  ngOnInit() {
    this.initializeForm()
    this.getCategories()
  }
  getCategories(){
    this.api.getAllCategories().subscribe((data: any) => {
      this.categories = data
    })
  }
  initializeForm() {
    this.addForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      date_added: new FormControl(''),
      date_modified: new FormControl(''),
      status: new FormControl('', Validators.required),
      stock: new FormControl(''),
      image: new FormControl(''),
      colors: new FormControl('', Validators.required),
      sizes: new FormControl('', Validators.required),
      prices: new FormControl('', Validators.required),
      cat_id: new FormControl('', Validators.required),
      gia_nhap: new FormControl('', Validators.required),
      promo_price: new FormControl(0),
      mo_ta: new FormControl(''),
      quantity: new FormControl(''),
    });
  }

  chooseImg(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const img = document.querySelector('.imgBox > img') as HTMLImageElement
    if (file) {
      this.addForm.patchValue({
        'image': file.name
      });
      img.src = `./assets/img/${file.name}`
    } else {
      this.addForm.patchValue({
        'image': 'img.jpg'
      });
    }
  }

  sizes: string[] = []
  prices: number[] = []
  quantities: number[] = []
  colors: string[] = []
  addSize() {
    const sizes_input = document.querySelector('.sizes-input') as HTMLElement
    const size = document.createElement('input')
    size.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement
      this.sizes.push(target.value)
    })
    size.style.width = '100px'
    size.style.padding = '8px 5px'
    size.style.borderRadius = '5px'
    size.style.border = 'none'
    size.style.outline = 'none'
    size.style.border = '1px solid rgb(197, 197, 197)'
    size.style.marginLeft = '10px'
    size.type = 'text'
    sizes_input.appendChild(size)
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
    color.style.marginLeft = '10px'
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
    this.sizes.push(target.value)
    this.addForm.patchValue({
      'sizes': this.sizes
    })
  }

  ngAfterViewInit(): void {
  }

  inputPrice(event: Event){
    const target = event.target as HTMLInputElement
    this.prices.push(parseInt(target.value))
    if(this.prices.length > 0){
      this.addForm.patchValue({
        'prices': this.prices
      })
    }
  }

  inputQuantity(event: Event){
    const target = event.target as HTMLInputElement
    this.quantities.push(parseInt(target.value))
    if(this.quantities.length > 0){
      this.addForm.patchValue({
        'quantity': this.quantities
      })
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
}
