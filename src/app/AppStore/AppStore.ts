import { Injectable } from "@angular/core";
import { TraderDTO } from "../DTOs/TraderDTO";
import { ComponentStore } from "@ngrx/component-store";

export interface AppState{
    traders:TraderDTO[]
}

@Injectable()
export class AppStore extends ComponentStore<AppState> {
  
  constructor() {
    super({traders: []});
  }
}