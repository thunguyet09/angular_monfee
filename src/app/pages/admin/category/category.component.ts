import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { API } from 'src/app/api/api.service';
import { Category } from 'src/app/interfaces/Category';
import { Theme } from 'src/app/interfaces/Theme';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements AfterViewInit{
  constructor(private themeService: ThemeService, private api: API, private router: Router){}
  public themes: Theme[] = []
  public bgColor: string = ''
  public categories: Category[] = []
  ngOnInit(){
    this.themeService.getTheme().subscribe((data:any) => {
      this.themes = data
      this.themes.forEach((item) => {
        const addBtn = document.querySelector('.add') as HTMLElement
        addBtn.style.backgroundColor = item.color
        this.bgColor = item.color
      })
    })

    // this.api.getAllCategories().subscribe((data:any) => {
    //   this.categories = data
    // })

    this.api.getCategoryPagination('1', '3').subscribe((data:any) => {
      this.categories = data.categories
    })
  }

  hoverAddBtn(event: Event){
    const target = event.target as HTMLElement
    target.style.backgroundColor = 'black'
    target.style.color = 'white'
  }

  leaveAddBtn(event: Event){
    const target = event.target as HTMLElement
    target.style.backgroundColor = this.bgColor
    target.style.color = 'black'
  }

  public ID: number = 0;
  public category_name: string = ''
  public date_value: string = ''
  public top: string = ''
  public status: string = ''

  ngAfterViewInit(): void{
    const filter_inputs = document.querySelectorAll<HTMLElement>('.row > input')
    const filter_selects = document.querySelectorAll<HTMLElement>('.row > select')
    filter_inputs.forEach((item) => {
      item.addEventListener('mouseleave', () => {
        item.style.borderColor = '#66afe9'
        item.style.boxShadow = 'inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, 0.6)'
      })
      document.addEventListener('click', () => {
        item.style.borderColor = 'rgb(210, 210, 210)'
        item.style.boxShadow = 'none'
      })
    })

    filter_selects.forEach((item) => {
      item.addEventListener('mouseleave', () => {
        item.style.borderColor = '#66afe9'
        item.style.boxShadow = 'inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, 0.6)'
      })
      document.addEventListener('click', () => {
        item.style.borderColor = 'rgb(210, 210, 210)'
        item.style.boxShadow = 'none'
      })
    })
  }

  public isToggle = false;
  handleFilter(){
    const filterContainer = document.querySelector('.filter-container') as HTMLElement
    this.isToggle = !this.isToggle
    if(this.isToggle){
      filterContainer.style.display = 'block'
      filterContainer.classList.add('appear');
    }else{
      filterContainer.style.display = 'none'
      filterContainer.classList.remove('appear');
    }
  }

  handleClear(){
    const id_input = document.querySelector('.ID_filter') as HTMLInputElement
    const category_name = document.querySelector('.categoryName_filter') as HTMLInputElement
    const date_value = document.querySelector('.date_value') as HTMLInputElement
    const top = document.querySelector('.top') as HTMLInputElement
    const status = document.querySelector('.status') as HTMLInputElement
    id_input.value = ''
    category_name.value = ''
    date_value.value = ''
    top.value = ''
    status.value = ''
  }

  public searchData: Category[] = []
  handleSearch(event: Event){
    const target = event.target as HTMLInputElement
    const filteredData = this.categories.filter((item) => item.name.toLowerCase().includes(target.value.toLowerCase()))
    this.searchData = filteredData
    if(target.value == ''){
      this.searchData = []
    }
  }

  handleView(id:number){
    localStorage.setItem('categoryId', id.toString())
  }
}
