import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryDTO } from 'src/app/DTOs/InventoryDTO';
import { ItemQuantityDTO } from 'src/app/DTOs/ItemQuantityDTO';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  apiURL ='https://localhost:7260/inventory/';
  constructor(private httpClient:HttpClient) { }
  
  public addToInventory(inventoryDTO:InventoryDTO): Observable<InventoryDTO>{
    return this.httpClient.post<InventoryDTO>(this.apiURL+'addToInventory',inventoryDTO);
  }
  public getAllInventory$():Observable<InventoryDTO[]>{
    return this.httpClient.get<InventoryDTO[]>(this.apiURL+"getAllInventory");
  }
  public getCurrentQuantites$():Observable<ItemQuantityDTO[]>{
    return this.httpClient.get<ItemQuantityDTO[]>(this.apiURL+"getCurrentQuantites");
  }
}
