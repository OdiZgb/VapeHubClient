import { Injectable } from "@angular/core";
import { TraderDTO } from "../DTOs/TraderDTO";
import { ComponentStore } from "@ngrx/component-store";
import { EmployeeDTO } from "../DTOs/EmployeeDTO";

export interface AppState{
  traders:TraderDTO[]
  employees:EmployeeDTO[]
}

@Injectable()
export class AppStore extends ComponentStore<AppState> {
  
  constructor() {
    super({traders: [], employees: []});
  }
}