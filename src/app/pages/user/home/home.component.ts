import { AfterViewInit, Component} from '@angular/core';
import { API } from 'src/app/api/api.service';
import { Product } from 'src/app/interfaces/Product';
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

  constructor(private api: API) {}

  ngOnInit(): void {
    this.fetchData();
  }

  public products: Product[] = []
  async fetchData(): Promise<void> {
    this.api.getAllProducts().subscribe((data:any) => {
      const newProducts = data.sort((a:any, b:any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      this.data = newProducts.slice(0, 8);
    })

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

  public data: Product[] = []
  public detail: Product[] = []
  public imgCarousel: string[] = []
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
}
