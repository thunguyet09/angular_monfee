import { Component } from '@angular/core';
import { API } from 'src/app/api/api.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  public user: User[] = []
  constructor(private api: API) { }
  ngOnInit() {
    const currentUser = localStorage.getItem('user')
    if (currentUser) {
      const storedUser = JSON.parse(currentUser) as User;
      this.api.getUserById(storedUser.user_id).subscribe((data: any) => {
        this.user = [data]
      })
    }
  }

  handlePasswordChange(){
    const accountRow = document.querySelector('.account-row') as HTMLElement
    accountRow.innerHTML = ''
    this.changePassword()
  }
  async changePassword() {
    const list = document.querySelector('.sub-list') as HTMLElement
    const accountRow = document.querySelector('.account-row') as HTMLElement
    const list_child = Array.from(list.childNodes)
    list_child.forEach((item: any) => {
      item.removeAttribute('id');
    });
    const changePasswordNode = list.childNodes[1] as HTMLElement
    changePasswordNode.setAttribute('id', 'active-list')
    const accountBox = document.createElement('div')
    accountBox.className = 'authenticateBox'
    accountRow.appendChild(accountBox)
    accountBox.style.width = '450px'
    accountBox.style.fontFamily = "'Roboto', sans-serif"
    accountBox.style.display = 'flex'
    accountBox.style.justifyContent = 'center'
    accountBox.style.alignItems = 'center'
    accountBox.style.flexDirection = 'column'
    accountBox.style.textAlign = 'center'
    const authenticateImg = document.createElement('img')
    authenticateImg.width = 130
    authenticateImg.src = './assets/img/authenticate.svg'
    accountBox.appendChild(authenticateImg)
    const authenticateText = document.createElement('h4')
    authenticateText.textContent = 'Please check your email for password reset link.'
    authenticateText.style.fontWeight = '400'
    authenticateText.style.fontSize = '17px'
    authenticateText.style.color = 'red'
    authenticateText.style.margin = '30px 0px 30px 0px'
    accountBox.appendChild(authenticateText)
    const authenticateBtn = document.createElement('button')
    authenticateBtn.addEventListener('mouseenter', () => {
      authenticateBtn.style.opacity = '0.8'
      authenticateBtn.style.cursor = 'pointer'
    })
    authenticateBtn.style.display = 'flex'
    authenticateBtn.style.flexDirection = 'row'
    authenticateBtn.style.alignItems = 'center'
    authenticateBtn.style.justifyContent = 'center'
    authenticateBtn.style.gap = '10px'
    authenticateBtn.style.border = 'none'
    authenticateBtn.style.outline = 'none'
    authenticateBtn.style.border = '1px solid rgb(231, 231, 231)'
    authenticateBtn.style.padding = '10px 30px'
    authenticateBtn.style.backgroundColor = 'white'
    authenticateBtn.style.transition = '.2s ease'
    authenticateBtn.innerHTML = `
        <span class="material-symbols-outlined">
            mail
        </span>
        <h4>Send Password Reset Link</h4>
    `
    const authenticateBtn_childText = authenticateBtn.childNodes[3] as HTMLElement
    authenticateBtn_childText.style.fontWeight = '600'
    authenticateBtn_childText.style.fontFamily = "'Mulish', sans-serif"
    authenticateBtn_childText.style.fontSize = '15px'
    authenticateBtn_childText.style.margin = '0'
    accountBox.appendChild(authenticateBtn)

    authenticateBtn.addEventListener('click', async () => {
      this.user.forEach((res:any) => {
        const info = {
          email: res.email,
          id: res._id
        }

        this.api.sendResetPasswordLink(info).subscribe((data:any) => {
          authenticateBtn.innerHTML = `
            <span class="material-symbols-outlined">
              check
            </span>
            <h4>Link Sent.</h4>
          `
          authenticateBtn.style.backgroundColor = '#72B42A'
          authenticateBtn.style.color = 'white'
          const authenticateBtn_text = authenticateBtn.childNodes[3] as HTMLElement
          authenticateBtn_text.style.margin = '0'
        })
      })
    })
  }

}
