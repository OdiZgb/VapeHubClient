import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { registerLicense } from '@syncfusion/ej2-base';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public date = new Date().getFullYear();
 
  constructor(private router:Router){
  registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCdkx0R3xbf1xzZFJMZVVbQXVPIiBoS35RdUVkW3xfeXFcQ2lYV0J3');
  }
  navigateToDefaulRoute(){
    this.router.navigate(['']);
  }
}
