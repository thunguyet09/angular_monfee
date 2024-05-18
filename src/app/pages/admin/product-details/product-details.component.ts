import { AfterViewInit, Component } from '@angular/core';
import { API } from 'src/app/api/api.service';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements AfterViewInit{
  constructor(private api: API){}
  public product: Product[] = []
  ngOnInit(): void {
    const id = localStorage.getItem('productId')
    this.api.getAllProducts().subscribe((data: any) => {
      if(id){
        this.product = data.filter((item: any) => {
          return item.id == parseInt(id)
        })
      }
    })
  }

  ngAfterViewInit(): void {

  }

  slideIndex = 0;
  handleNextSlide(){
    const swiper_wrapper = document.querySelector('.swiper-wrapper') as HTMLElement
    const nav_img = document.querySelectorAll('.product-nav-slider > img')
    this.slideIndex = (this.slideIndex + 1) % swiper_wrapper.children.length;
    nav_img.forEach((item: any) => {
      item.classList.remove('slider-active')
    })
    nav_img[this.slideIndex].classList.add('slider-active')
    if(this.slideIndex > 2){
      this.slideIndex = 0;
      swiper_wrapper.style.transform = `translateX(0px)`
    }else{
      this.updateSliderPosition();
    }
  }
  handlePrevSlide(){
    const swiper_wrapper = document.querySelector('.swiper-wrapper') as HTMLElement
    if(this.slideIndex == 0){
      this.slideIndex = 2;
      const slideWidth = swiper_wrapper.clientWidth - 5;
      swiper_wrapper.style.transform = `translateX(-${this.slideIndex * slideWidth}px)`;
    }else{
      this.slideIndex = (this.slideIndex - 1 + swiper_wrapper.children.length) % swiper_wrapper.children.length;
      this.updateSliderPosition();
    }
  }

  updateSliderPosition() {
    const swiper_wrapper = document.querySelector('.swiper-wrapper') as HTMLElement
    const slideWidth = swiper_wrapper.clientWidth;
    swiper_wrapper.style.transform = `translateX(-${this.slideIndex * slideWidth}px)`;
  }
}
