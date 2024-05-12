import { AfterViewInit, Component } from '@angular/core';
import { Theme } from 'src/app/interfaces/Theme';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit{
  public isToggled = false;
  constructor(private themeService: ThemeService){}
  public themes: Theme[] = []
  ngOnInit(){
    this.themeService.getTheme().subscribe((data) => {
      this.themes = data
      this.themes.forEach((item) => {
        const header = document.getElementById('header') as HTMLElement
        header.style.backgroundColor = item.color
      })
    })
  }
  ngAfterViewInit(): void{
    const user_name = document.querySelector('.avatarBox > div > h4') as HTMLElement
    const full_name = localStorage.getItem('username')
    if(full_name){
      user_name.textContent = full_name
    }

    const sidebarWrapper = document.querySelectorAll('.sidebar-wrapper > li');
    sidebarWrapper.forEach((item) => {
      item.addEventListener('click', () => {
        sidebarWrapper.forEach((val) => {
          if (val instanceof HTMLElement) {
            const firstElement = val.childNodes[0] as HTMLElement
            firstElement.removeAttribute('id')
            const linkElement = val.childNodes[1];
            if (linkElement instanceof HTMLElement) {
              linkElement.removeAttribute('id')
              linkElement.classList.add('unactive');
            }
          }
        });
        if (item instanceof HTMLElement) {
          const firstElement = item.childNodes[0] as HTMLElement
          firstElement.setAttribute('id', 'activeLink')
          const linkElement = item.childNodes[1];
          if (linkElement instanceof HTMLElement) {
            linkElement.setAttribute('id', 'activeLink')
            linkElement.classList.remove('unactive')
          }
        }
      });
    });

    const apps = document.querySelectorAll('.apps');
    apps.forEach((item: Element) => {
      item.addEventListener('click', () => {
        this.isToggled = !this.isToggled;
        const childNode = item.childNodes[1];
        if (childNode instanceof HTMLElement) {
          childNode.style.display = this.isToggled ? 'block' : 'none';
        }
      });
    });

    window.addEventListener('scroll', function(){
      const mini_sidebar = document.querySelector('.mini_sidebar') as HTMLElement
      if(this.scrollY > 60){
          mini_sidebar.style.top = '0';
      }else {
          mini_sidebar.style.top = '66px'
      }
  })

  }
  pallete(){
    const palleteBox = document.querySelector('.palleteBox') as HTMLElement
    this.isToggled = !this.isToggled;
    if(this.isToggled){
        palleteBox.style.display = 'flex'
    }else {
        palleteBox.style.display = 'none'
    }
  }

  generalClick(){
    const general = document.querySelector('.general') as HTMLElement;
    this.isToggled = !this.isToggled;
    const childNode = general.childNodes[1];
    if (childNode instanceof HTMLElement) {
      childNode.style.display = this.isToggled ? 'block' : 'none';
    }
  }

  miniSidebarMouseEnter(event: Event){
    const sidebar = document.querySelector('.sidebar') as HTMLElement
    sidebar.style.left = '0px'
    const target = event.target as HTMLElement
    target.style.left = '-70px'
  }

  closeSideBar(){
    const mini_sidebar = document.querySelector('.mini_sidebar') as HTMLElement
    const sidebar = document.querySelector('.sidebar') as HTMLElement
    mini_sidebar.style.left = '0px'
    sidebar.style.left = '-200px'
  }

  public isLight = true;
  darkAndLight(){
    const target = document.querySelector('.dark-and-light') as HTMLElement
    this.isLight = !this.isLight
    if (this.isLight) {
      target.innerHTML = '<i class="fa-regular fa-moon"></i>';
      target.style.fontSize = '20px'
    }else{
      target.innerHTML = `<span class="material-symbols-outlined">light_mode</span>`
    }
  }
}

