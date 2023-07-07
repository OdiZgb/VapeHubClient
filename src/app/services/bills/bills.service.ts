import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BillDTO } from 'src/app/DTOs/BillDTO';
import { CategoryDTO } from 'src/app/DTOs/CategoryDTO';

@Injectable({
  providedIn: 'root'
})
export class BillsService {
  apiURL ='https://localhost:7260/bill/';
  constructor(private httpClient:HttpClient) { }

  public addToBill(category:BillDTO): Observable<BillDTO>{
    return this.httpClient.post<BillDTO>(this.apiURL+'addToBill',category);
  }
  public getAllBills$():Observable<BillDTO[]>{
    return this.httpClient.get<BillDTO[]>(this.apiURL+"getAllBills");
  }
}
