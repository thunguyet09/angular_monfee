import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { API } from 'src/app/api/api.service';
import { MiniCart } from 'src/app/services/mini_cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isHome = false;
  isShop = false;
  isDetail = false;
  isLogin = false;
  isRegister = false;
  openMiniCart = false;
  isAccount = false;
  isResetPassword = false;
  constructor(private router: Router, private minicart: MiniCart, private api: API){}

  ngOnInit(){
    const url = new URL(document.location.href);
    const path = url.pathname.split('/').filter(Boolean);
    const value = path[path.length - 1];
    const detail = path[path.length - 2]
    if(typeof value == 'undefined' || value == 'home'){
      this.isHome = true;
    }else if(value == 'shop'){
      this.isShop = true;
    }else if(detail){
      this.isDetail = true;
    }else if(value == 'register'){
      this.isRegister = true;
    }else if(value == 'login'){
      this.isLogin = true;
    }else if(value == 'account'){
      this.isAccount = true;
    }else if(value == 'reset-password'){
      this.isResetPassword = true;
    }
    this.detail_page()
    this.handleHeader()
    this.numsInCart()
    this.minicart.getMiniCart().subscribe((val) => {
      this.openMiniCart = val;
    })
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.handleScroll();
  }

  handleScroll() {
    const header = document.getElementById('header') as HTMLElement
    const menuItems = document.querySelectorAll<HTMLElement>('.leftHeader > ul > li > a');
    const icons = document.querySelectorAll<HTMLElement>('.rightHeader > span > span');
    const shoppingIcon = document.querySelector('.rightHeader > span:last-child') as HTMLElement

    if (window.scrollY > 66) {
      header.style.animation = 'slideDown 2s linear';
      if (this.isHome) {
        header.style.backgroundColor = 'rgba(26, 26, 26, 0.9)';
        menuItems.forEach((node: HTMLElement) => {
          node.style.color = 'white';
        });

        icons.forEach((node: HTMLElement) => {
          node.style.color = 'white';
        });

        shoppingIcon.style.color = 'white';
      } else {
        header.style.backgroundColor = 'white';
        menuItems.forEach((node: HTMLElement) => {
          node.style.color = 'black';
        });

        icons.forEach((node: HTMLElement) => {
          node.style.color = 'black';
        });

        shoppingIcon.style.color = 'black';
      }
      header.style.position = 'fixed';
      header.style.zIndex = this.openMiniCart ? '1' : '2';
      header.style.top = '0';
      header.style.left = '0';
      header.style.right = '0';
      header.style.boxShadow = '0 2px 5px -2px #0000001a';
      header.style.transition = 'transform .35s cubic-bezier(.46,.01,.32,1), opacity .4s ease-out;';
    } else {
      if (this.isShop || this.isDetail || this.isRegister || this.isLogin || this.isAccount
        || this.isResetPassword) {
        header.style.backgroundColor = 'white';
        header.style.position = 'absolute';
        menuItems.forEach((node: HTMLElement) => {
          node.style.color = 'black';
        });
      } else {
        header.style.position = 'absolute';
        header.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        menuItems.forEach((node: HTMLElement) => {
          node.style.color = 'white';
        });

        icons.forEach((node: HTMLElement) => {
          node.style.color = 'white';
        });

        shoppingIcon.style.color = 'white';
      }
    }
  }

  handleHeader() {
    const header = document.getElementById('header') as HTMLElement;
    const shoppingIcon = document.querySelector('.rightHeader > span:last-child') as HTMLElement;
    const menuItems = document.querySelectorAll('.leftHeader > ul > li > a');
    const icons = document.querySelectorAll('.rightHeader > span > span');
    const userChecked = document.querySelector('.userChecked > span > i') as HTMLElement;
    const subAvatar = document.querySelector('.subAvatar') as HTMLElement;
    const userElement = document.querySelector('.userChecked') as HTMLElement
    shoppingIcon.addEventListener('click', () => {
      this.minicart.setMiniCart(true)
    });

    if (this.isHome) {
      menuItems.forEach((node) => {
        (node as HTMLElement).style.color = 'white';
      });
      icons.forEach((node) => {
        (node as HTMLElement).style.color = 'white';
      });
      (shoppingIcon as HTMLElement).style.color = 'white';
    } else {
      header.style.backgroundColor = 'white'
      menuItems.forEach((node) => {
        (node as HTMLElement).style.color = 'black';
      });
      icons.forEach((node) => {
        (node as HTMLElement).style.color = 'black';
      });
      (shoppingIcon as HTMLElement).style.color = 'black';
    }

    const token = localStorage.getItem('user')
    subAvatar.childNodes[2].addEventListener('click', () => {
      localStorage.clear();
      document.location.href = '/';
      const userElementChild = userElement.childNodes[0] as HTMLElement
      userElementChild.innerHTML = '<i class="fa-solid fa-user"></i>'
    });

    userChecked.addEventListener('click', () => {
      document.location.href = '/login';
    });

    if (token !== null) {
      const userElementChild = userElement.childNodes[0] as HTMLElement
      userElementChild.innerHTML = '<i class="fa-solid fa-user-check"></i>'
    }


  }

  detail_page() {
    const header = document.getElementById('header') as HTMLElement
    const shoppingIcon = document.querySelector('.rightHeader > span:last-child') as HTMLElement;
    const menuItems = document.querySelectorAll<HTMLElement>('.leftHeader > ul > li > a');
    const icons = document.querySelectorAll<HTMLElement>('.rightHeader > span > span');
    if(this.openMiniCart == true){
      header.style.zIndex = '-3'
    }else{
      header.style.zIndex = '2'
    }
    if(this.isDetail){
      menuItems.forEach((node) => {
        node.style.color = 'black'
      })
      icons.forEach((node) => {
        node.style.color = 'black'
      })
      shoppingIcon.style.color = 'black'
    }
  }

  public carts = []
  async numsInCart() {
    const userId = localStorage.getItem('userId')
    this.api.getCarts().subscribe((val:any) => {
      this.carts = val
    })
    const numsInCart = document.querySelector('.numsInCart') as HTMLElement
    const filteredCarts = this.carts.filter(((item:any) => item.user_id == userId))
    numsInCart.innerHTML = `${filteredCarts.length}`
  }

  navigateToLogin(){
    this.router.navigate(['/login'])
  }
}


