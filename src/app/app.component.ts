import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { registerLicense } from '@syncfusion/ej2-base';
import { AuthServiceService } from './services/auth/auth-service.service';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public date = new Date().getFullYear();
  loggedin: boolean = false;
  items: MenuItem[]=[];

  constructor(private router: Router, private authServiceService: AuthServiceService) {
    
  }
  ngOnInit(): void {
    registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCdkx0R3xbf1xzZFJMZVVbQXVPIiBoS35RdUVkW3xfeXFcQ2lYV0J3');
    this.authServiceService.loggedInSubject.subscribe(x=>{
      console.log('loggedInSubject fired', x);
      this.loggedin = x;

    });
    if (localStorage.getItem("token")?.length) {
      this.loggedin = true;

      };
    this.items = [
      {
        label: 'logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
    ];  }
  logout() {
    localStorage.removeItem("token");
    this.loggedin = false;
  }
  navigateToDefaulRoute() {
    this.router.navigate(['']);
  }
}
