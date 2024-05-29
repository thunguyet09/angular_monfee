import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { API } from 'src/app/api/api.service';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  constructor(private api: API,
    private router: Router) { }
  public detail: Product[] = []
  public products: Product[] = []
  public prev_prod: Product[] = []
  public next_prod: Product[] = []
  public currentUrl = new URL(window.location.href);
  public productId: number = parseInt(this.currentUrl.pathname.split('/')[2]);
  public lengthOfProducts: number = 0;
  public top_selling_product:Product[] =[]
  public originalQuantity = 0
  public maxQuantity = 0
  public remain_quantity = 0
  ngOnInit() {

    this.api.getAllProducts().subscribe((data: any) => {
      this.products = data
      const maxSales = Math.max(...data.map((item:any) => item.sales))
      this.top_selling_product = data.filter((item:any) => item.sales == maxSales)
      this.lengthOfProducts = data.length
    })
    if(this.productId == 0){
      this.loadPrevProdData(this.productId)
    }else{
      this.loadPrevProdData(this.productId - 1)
    }

    if(this.productId > this.lengthOfProducts){
      this.loadNextProdData(this.lengthOfProducts)
    }else{
      this.loadNextProdData(this.productId + 1)
    }
    this.loadDetail(this.productId)
    this.handleAdditionalInformation()
  }

  public zeroIndices:number[] = [];
  loadDetail(productId:number){
    this.api.getDetail(productId).subscribe((data: any) => {
      this.detail = [data]
      this.originalQuantity = data.sales + data.quantity.reduce((sum:any, q:any) => sum + q, 0);
      console.log(this.originalQuantity)
      this.maxQuantity = Math.max(...data.quantity)
      this.remain_quantity = this.originalQuantity - this.maxQuantity

      this.findZeroIndices(data.quantity)
    })
  }

  private findZeroIndices(quantities: number[]): void {
    this.zeroIndices = quantities.reduce((indices:number[], quantity, index) => {
      if (quantity === 0) {
        indices.push(index);
      }
      return indices;
    }, []);
  }
  loadNextProdData(nextProdId: number) {
    this.api.getDetail(nextProdId).subscribe((data: any) => {
      this.next_prod = [data]
    })
  }

  loadPrevProdData(prevProdId: number) {
    this.api.getDetail(prevProdId).subscribe((data: any) => {
      this.prev_prod = [data]
    })
  }
  handlePrevProdBtn() {
    this.productId = this.productId - 1
    if (this.productId < 1) {
      this.productId = 0
      this.router.navigate(['/products', this.productId])
      this.loadPrevProdData(this.productId)
      this.loadDetail(this.productId)
    } else {
      this.router.navigate(['/products', this.productId])
      this.loadPrevProdData(this.productId - 1)
      this.loadDetail(this.productId)
    }
  }

  handleNextProdBtn() {
    this.productId = this.productId + 1
    if (this.productId > this.lengthOfProducts) {
      this.productId = this.lengthOfProducts
      this.router.navigate(['/products', this.productId])
      this.loadNextProdData(this.productId)
      this.loadDetail(this.productId)
    } else {
      this.router.navigate(['/products', this.productId])
      this.loadNextProdData(this.productId + 1)
      this.loadDetail(this.productId)
    }
  }

  NextProdBtnMouseEnter(e: Event){
    const target = e.target as HTMLElement
    const next_element = target.nextSibling as HTMLElement
    next_element.style.display = 'flex'
    next_element.classList.add('slideRight')
    next_element.classList.remove('slideLeft')
  }

  nextProdBtnMouseLeave(e: Event){
    const target = e.target as HTMLElement
    const next_element = target.nextSibling as HTMLElement
    next_element.classList.add('slideLeft')
    next_element.classList.add('slideRight')
    setTimeout(() => {
      next_element.style.display = 'none'
    }, 800)
  }

  prevProdMouseEnter(e: Event){
    const target = e.target as HTMLElement
    const next_element = target.nextSibling as HTMLElement
    next_element.style.display = 'flex'
    next_element.classList.add('slideRight')
    next_element.classList.remove('slideLeft')
  }

  prevProdMouseLeave(e: Event){
    const target = e.target as HTMLElement
    const next_element = target.nextSibling as HTMLElement
    next_element.classList.add('slideLeft')
    next_element.classList.add('slideRight')
    setTimeout(() => {
      next_element.style.display = 'none'
    }, 800)
  }

  handleImgSlide(img:string){
    const imgFeatured = document.getElementById('featured') as HTMLElement
    const imgAfter = document.querySelector('.img1') as HTMLImageElement
    imgFeatured.style.transform = 'translateX(-400px)'
    imgFeatured.style.transition = '.5s ease'
    imgFeatured.style.opacity = '0'
    imgFeatured.style.zIndex = '0'
    imgAfter.src = `./assets/img/${img}`
    imgAfter.style.transform = 'translateX(0)'
    imgAfter.style.zIndex = '9'
  }

  handleAdditionalInformation(){
    const navTabFirstChild = document.querySelector('.nav_tab') as HTMLElement
    console.log(navTabFirstChild)
    navTabFirstChild.setAttribute('id', 'nav_tab_after')
    navTabFirstChild.style.borderBottom = '2px solid #b8784e'
  }
}
