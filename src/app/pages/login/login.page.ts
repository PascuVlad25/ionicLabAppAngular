import { Component, OnInit } from '@angular/core';
import { AnimationController, NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
  public username = '';
  public password = '';

  constructor(private authService: AuthenticationService, private navController: NavController, private animationController: AnimationController) {
    console.log('Is logged in', this.authService.isAuthenticated());
  }

  public ngOnInit(): void {
    this.animateLogo();
  }

  public login(): void {
    this.authService.login(this.username, this.password).then((value) => {
      this.navController.navigateRoot('home');
    }).catch((err) => {
      console.log('EROARE', err)
    })
  }

  private animateLogo(): void {
    const animation = this.animationController.create()
    .addElement(document.querySelector(".logo"))
    .easing("ease-in-out")
    .duration(1000)
    .direction("alternate")
    .iterations(Infinity)
    .keyframes([
      { offset: 0, transform: "scale(0.7)", opacity: "1" },
      { offset: 1, transform: "scale(1)", opacity: "0.5" }
    ]);
    
    animation.play();
  }
}
