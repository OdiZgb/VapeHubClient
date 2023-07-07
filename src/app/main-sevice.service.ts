import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ItemDTO } from './DTOs/ItemDTO';
import { CategoryDTO } from './DTOs/CategoryDTO';
import { MarkaDTO } from './DTOs/MarkaDTO';
import { TradersService } from './services/TradersService/traders.service';
import { AppStore } from './AppStore/AppStore';
import { TraderDTO } from './DTOs/TraderDTO';
import { EmployeeService } from './services/EmployeeService/employee.service';
import { EmployeeDTO } from './DTOs/EmployeeDTO';
import { SalaryDTO } from './DTOs/SalaryDTO';
import { BillsService } from './services/bills/bills.service';
import { ClientService } from './services/Clients/client.service';
@Injectable({
  providedIn: 'root'
})
export class MainSeviceService implements OnInit{
  itemsList:ItemDTO[] =[];
  categories:CategoryDTO[] = [];
  markas:MarkaDTO[] = [];
  categoriesDict: Record<number, boolean> = {
  };
  markasDict: Record<number, boolean> = {
  };

  traders = of<TraderDTO[]>();
  employees = new Observable<EmployeeDTO[]>();
  salaries = new Observable<SalaryDTO[]>();
  constructor(public tradersService: TradersService,public billingService: BillsService,public clientService: ClientService,public employeeService :EmployeeService, public store$:AppStore) {
    this.traders = this.store$.select(x => x.traders);
     this.setUpObservables();
   }
  
  ngOnInit(): void {

    this.setUpObservables();
  }

  setUpObservables(){
    this.tradersService.getAllTraders$().subscribe(x=>{
      this.store$.setState(state => ({ ...state, traders:x }));
      this.traders=this.store$.select(x=>x.traders);
    });
    this.employeeService.getAllEmployees$().subscribe(x=>{
      this.store$.setState(state => ({ ...state, employees:x }));
      this.employees=this.store$.select(x=>x.employees);
    });
    this.employeeService.getAllSalaries$().subscribe(x=>{
      this.store$.setState(state => ({ ...state, salaries:x }));
      this.salaries=this.store$.select(x=>x.salaries);
    });
  }


}
