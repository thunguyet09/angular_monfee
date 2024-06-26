import { AfterViewInit, Component} from '@angular/core';
import { API } from 'src/app/api/api.service';
import { New } from 'src/app/models/New';
import { Product } from 'src/app/models/Product';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { TokenResetPasswordService } from 'src/app/services/token_reset_password.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  currentIndex: number = 0;
  slides: { imageUrl: string, alt: string, h3: string, h3_animate: string, h1: string, h1_animate: string, h2: string, h2_animate: string, button: string, button_animate: string }[] = [
    { imageUrl: './assets/img/carousel1.webp', alt: 'Image 1', h3: "DON'T MISS TODAY'S FEATURED DEALS", h3_animate: 'h3_animate1', h1: "Start A Day With Coffee", h1_animate: 'h1_animate1', h2: "Here to bring your life style to the next level.", h2_animate: 'h2_animate1', button: "SHOP NOW", button_animate: 'button_animate1' },
    { imageUrl: './assets/img/carousel2.webp', alt: 'Image 2', h3: "NEED-IT-NOW", h3_animate: 'h3_animate2', h1: "Start A Day With Coffee", h1_animate: 'h1_animate2', h2: "Contemporary, minimal and beautifully iconic.", h2_animate: 'h2_animate2', button: "BUY NOW", button_animate: 'button_animate2' }
  ];

  public currentUser: User | null = null;
  constructor(private api: API,
    private tokenResetPasswordService: TokenResetPasswordService,
    private tokenService: TokenService,
    private authService: AuthService) {
      this.authService.currentUser.subscribe((user:any) => {
        this.currentUser = user;
      });
    }

  ngOnInit(): void {
    this.fetchData();
    this.handleDraggable();
    this.tokenResetPasswordService.getToken().subscribe((accessToken) => {
      this.tokenResetPasswordService.isAccessTokenExpired(accessToken).subscribe((tokenExpired) => {
        console.log('tokenExpired', tokenExpired)
      })
    })
    this.getNewAccessToken()
  }

  async getNewAccessToken() {
    try {
      const newAccessToken = await this.tokenService.handleExpiredToken();
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }

  public data: Product[] = []
  public detail: Product[] = []
  public imgCarousel: string[] = []
  public products: Product[] = []
  public sale_products: Product[] = []
  public news: New[] = []
  public slideIndex = 0;
  async fetchData(): Promise<void> {
    this.api.getAllProducts().subscribe((data:any) => {
      const newProducts = data.sort((a:any, b:any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      this.data = newProducts.slice(0, 8);
    })

    this.api.getAllProducts().subscribe((data:any) => {
      const res = data.filter((item:any) => {
        return (
          item.hasOwnProperty("promo_price") &&
          typeof item.promo_price !== "undefined" &&
          item.promo_price.length > 0
        );
      })

      this.sale_products = res.slice(0,8)

      this.api.getNewsApproved().subscribe((data:any) => {
        this.news = data
        .sort((a:any, b:any) => {
          return +new Date(b.createdAt) - +new Date(a.createdAt);
        })
        .slice(0, 8);
      })
    })
  }

  getDate(createdAt:any){
    return new Date(createdAt).getDate()
  }

  getMonth(createdAt:any){
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return monthNames[new Date(createdAt).getMonth()]
  }
  handlePrevClick(): void {
    this.currentIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
  }

  handleNextClick(): void {
    this.currentIndex = this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;
  }


  ngAfterViewInit(): void {
    const categoryImages = document.querySelectorAll('.homeCol2 > div > img')
    categoryImages.forEach((item: Element) => {
      item.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      item.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    });
  }


  handleNewProductEnter(event: Event): void {
    const element = event.target as HTMLElement;
    if (element.childNodes[0] instanceof HTMLElement) {
      element.childNodes[0].style.display = 'flex';
    }
  }

  handleNewProductLeave(event: Event): void {
    const element = event.target as HTMLElement;
    if (element.childNodes[0] instanceof HTMLElement) {
      element.childNodes[0].style.display = 'none';
    }
  }

  handleMouseEnter(event: Event): void {
    const element = event.target as HTMLElement;
    const parentNode = element.parentNode as HTMLElement;
    parentNode.classList.add('hovered');
  }

  handleMouseLeave(event: Event): void {
    const element = event.target as HTMLElement;
    const parentNode = element.parentNode as HTMLElement;
    parentNode.classList.remove('hovered');
  }

  handleThumbnails(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLElement || target instanceof Element) {
      const imgThumbnails = target.parentNode;
      const productItem = imgThumbnails?.parentNode
      const productItemChild = productItem?.childNodes
      if(productItemChild !== undefined){
        const img = productItemChild[1].childNodes[0] as HTMLImageElement
        img.src = (target as HTMLImageElement).src
      }
      if (imgThumbnails !== null) {
        const children = imgThumbnails.children;
        Array.from(children).forEach((item) => {
          item.removeAttribute('class')
        })
      }
      target.setAttribute('class', 'activeImg')
    }
  }

  async handleQuickView(id:any): Promise<void>{
    this.api.getDetail(id).subscribe((val:any) => {
      const dataArray = [val]
      this.detail = dataArray
      dataArray.forEach((item) => {
        this.imgCarousel = item.img_url.slice(0,3)
      })
      const quickViewModal = document.querySelector('.quickViewModal') as HTMLElement
      quickViewModal.style.display = 'block'
    })
  }

  closeQuickView(){
    const quickViewModal = document.querySelector('.quickViewModal') as HTMLElement
    quickViewModal.style.display = 'none'
  }

  public sizeIndex = 0;
  sizes: string[] = []

  activeSize(event: Event, sizeArr:any){
    const sizeItems = document.querySelectorAll('.sizeItems > button')
    sizeItems.forEach((item) => {
      item.removeAttribute('id')
    })
    const target = event.target
    if (target instanceof HTMLElement || target instanceof Element) {
      target.setAttribute('id', 'activeSize')
      const text = target.textContent
      const index = sizeArr.indexOf(text)

      if(index !== 0){
        this.sizeIndex = index
      }else{
        this.sizeIndex = 0
      }
    }
  }

  public colorIndex = 0;
  activeColor(event: Event, colorArr:any, color:any){
    const colorItems = document.querySelectorAll('.colorItems > button')
    colorItems.forEach((item) => {
      item.removeAttribute('id')
    })
    const target = event.target as HTMLElement
    if (target instanceof HTMLElement) {
      target.setAttribute('id', 'colorActive')
      const index = colorArr.indexOf(color)
      if(index !== 0){
        this.colorIndex = index
      }else{
        this.colorIndex = 0
      }
    }
  }

  public quantity:number = 1;
  increaseQuantity(){
    this.quantity++;
  }

  decreaseQuantity(){
    this.quantity--;
  }

  addToCart(){
    console.log(this.quantity)
  }

  saleProductMouseEnter(event: Event){
    const target = event.target as HTMLElement
    const actions = target.childNodes[0] as HTMLElement
    actions.style.display = 'flex'
  }

  saleProductMouseLeave(event: Event){
    const target = event.target as HTMLElement
    const actions = target.childNodes[0] as HTMLElement
    actions.style.display = 'none'
  }

  handleDraggable(){
    const draggableBtns = document.querySelectorAll('.draggable > button')
    const productBox = document.querySelector('.products_sale') as HTMLElement
    draggableBtns.forEach((val:any) => {
      val.addEventListener("click", () => {
        draggableBtns.forEach((res) => {
          res.removeAttribute("id");
        });
        val.setAttribute("id", 'slide_active');
        if (val.textContent == 2) {
          productBox.style.transform = "translate3d(-1250px, 0px, 0px)";
        } else if (val.textContent == 3) {
          productBox.style.transform = "translate3d(-1670px, 0px, 0px)";
        } else {
          productBox.style.transform = "translate3d(0px, 0px, 0px)";
        }
      });
    });
  }

  mouseenterNews(){
    const prevBtn = document.querySelector('.prev_button') as HTMLElement
    const nextBtn = document.querySelector('.next_button') as HTMLElement
    prevBtn.style.display = 'block'
    nextBtn.style.display = 'block'
  }

  mouseleaveNews(){
    const prevBtn = document.querySelector('.prev_button') as HTMLElement
    const nextBtn = document.querySelector('.next_button') as HTMLElement
    prevBtn.style.display = 'none'
    nextBtn.style.display = 'none'
  }

  updateSliderPosition() {
    const sliderContainer = document.querySelector('.slider_container') as HTMLElement
    const slideWidth = sliderContainer.clientWidth;
    sliderContainer.style.transform = `translateX(-${this.slideIndex * slideWidth}px)`;
  }

  handlePrevButton(){
    const sliderContainer = document.querySelector('.slider_container') as HTMLElement
    if (this.slideIndex == 0) {
      this.slideIndex = 2;
      const slideWidth = sliderContainer.clientWidth;
      sliderContainer.style.transform = `translateX(-${this.slideIndex * slideWidth}px)`;
    } else {
      this.slideIndex = (this.slideIndex - 1 + sliderContainer.children.length) % sliderContainer.children.length;
      this.updateSliderPosition();
    }
  }

  handleNextButton(){
    const sliderContainer = document.querySelector('.slider_container') as HTMLElement
    this.slideIndex = (this.slideIndex + 1) % sliderContainer.children.length;
    if (this.slideIndex > 2) {
      this.slideIndex = 0;
      sliderContainer.style.transform = `translateX(0px)`;
    } else {
      this.updateSliderPosition();
    }
  }
}
