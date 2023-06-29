import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ItemDTO } from './DTOs/ItemDTO';
import { CategoryDTO } from './DTOs/CategoryDTO';
import { MarkaDTO } from './DTOs/MarkaDTO';
import { TradersService } from './services/TradersService/traders.service';
import { AppStore } from './AppStore/AppStore';
import { TraderDTO } from './DTOs/TraderDTO';
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
  constructor(public tradersService: TradersService, public store$:AppStore) {
    this.traders = this.store$.select(x => x.traders);
    this.setUpObservables();
   }
  
  ngOnInit(): void {
    this.setUpObservables();
  }

  setUpObservables(){
    this.tradersService.getAllTraders$().subscribe(x=>{
      this.store$.setState({traders:x});
      this.traders=this.store$.select(x=>x.traders);
    });
  }


}
