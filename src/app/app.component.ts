import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public date = new Date().getFullYear();
 
  constructor(private router:Router){}
  navigateToDefaulRoute(){
    this.router.navigate(['']);
  }
}
