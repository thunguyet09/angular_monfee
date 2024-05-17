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
  ngOnInit(){
    this.themeService.getTheme().subscribe((data: any) => {
      this.themes = data;
      this.themes.forEach((item) => {
        const addBtn = document.querySelector('.add-btn') as HTMLElement;
        addBtn.style.backgroundColor = item.color;
      });
    });

    this.api.getAllProducts().subscribe((data: any) => {
      this.products = data
    })

    this.api.getAllCategories().subscribe((data: any) => {
      this.categories = data
    })
  }

  getCategoryName(catId: number): string {
    const category = this.categories.find(c => c.id === catId);
    return category ? category.name : '';
  }

  handleAction(event: Event){
    const target = event.target as HTMLElement
    const parentNode = target.parentNode
    const childElement = parentNode?.childNodes[1] as HTMLElement
    childElement.style.display = 'block'
  }

  ngAfterViewInit(): void {

  }
}
