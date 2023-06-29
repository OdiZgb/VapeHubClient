import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { InventoryDTO } from 'src/app/DTOs/InventoryDTO';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { TraderDTO } from 'src/app/DTOs/TraderDTO';
import { TradersService } from 'src/app/services/TradersService/traders.service';

@Component({
  selector: 'app-add-trader',
  templateUrl: './add-trader.component.html',
  styleUrls: ['./add-trader.component.scss']
})
export class AddTraderComponent {
  constructor(private traderService:TradersService){}

  public addTrader(traderDTO:TraderDTO):Observable<TraderDTO>{
    return this.traderService.addTrader(traderDTO)
  }
 
}
