import { Component } from '@angular/core';
import { Theme } from 'src/app/models/Theme';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  constructor(private themeService: ThemeService){}
  public themes: Theme[] = [];
  ngOnInit(){
    this.themeService.getTheme().subscribe((data: any) => {
      this.themes = data;
      this.themes.forEach((item) => {
        const addBtn = document.querySelector('.add-btn') as HTMLElement;
        addBtn.style.backgroundColor = item.color;
      });
    });
  }
}
