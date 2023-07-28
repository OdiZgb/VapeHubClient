import { Component, OnInit } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { AppStore } from 'src/app/AppStore/AppStore';
import { EmployeeDTO } from 'src/app/DTOs/EmployeeDTO';
import { MainSeviceService } from 'src/app/main-sevice.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit{

  employees : EmployeeDTO[] =[];

  constructor(public store$:AppStore,public mainSeviceService:MainSeviceService){}

  async ngOnInit(): Promise<void> {
    this.mainSeviceService.employees.subscribe(x=>{
      this.employees = x;
    })
  }

}
