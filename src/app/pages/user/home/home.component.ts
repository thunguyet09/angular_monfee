import { AfterViewInit, Component} from '@angular/core';
import { getAllProducts } from 'src/app/api/api';
import { Product } from 'src/app/interfaces/Product';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  currentIndex: number = 0;

  public data: Product[] = []
  slides: { imageUrl: string, alt: string, h3: string, h3_animate: string, h1: string, h1_animate: string, h2: string, h2_animate: string, button: string, button_animate: string }[] = [
    { imageUrl: './assets/img/carousel1.webp', alt: 'Image 1', h3: "DON'T MISS TODAY'S FEATURED DEALS", h3_animate: 'h3_animate1', h1: "Start A Day With Coffee", h1_animate: 'h1_animate1', h2: "Here to bring your life style to the next level.", h2_animate: 'h2_animate1', button: "SHOP NOW", button_animate: 'button_animate1' },
    { imageUrl: './assets/img/carousel2.webp', alt: 'Image 2', h3: "NEED-IT-NOW", h3_animate: 'h3_animate2', h1: "Start A Day With Coffee", h1_animate: 'h1_animate2', h2: "Contemporary, minimal and beautifully iconic.", h2_animate: 'h2_animate2', button: "BUY NOW", button_animate: 'button_animate2' }
  ];

  constructor() {

  }

  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    const products = await getAllProducts();
    const newProducts = products.sort((a:any, b:any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    this.data = newProducts.slice(0, 8);
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
}
