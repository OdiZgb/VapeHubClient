import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeDTO } from 'src/app/DTOs/EmployeeDTO';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  apiURL = 'https://localhost:7260/employee/';
  constructor(private httpClient: HttpClient) { }

  public addEmployee(EmployeeDTO: EmployeeDTO): Observable<EmployeeDTO> {
    return this.httpClient.post<EmployeeDTO>(this.apiURL + 'addEmployee', EmployeeDTO);
  }
  public getEmployee$(): Observable<EmployeeDTO[]> {
    return this.httpClient.get<EmployeeDTO[]>(this.apiURL + "getEmployee");
  }
  public getAllEmployees$(): Observable<EmployeeDTO[]> {
    return this.httpClient.get<EmployeeDTO[]>(this.apiURL + "getAllEmployees");
  }
}