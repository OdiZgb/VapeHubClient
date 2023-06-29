import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceService } from '../services/PriceService/price.service';
import { PriceInDTO } from '../DTOs/PriceInDTO';
import { PriceOutDTO } from '../DTOs/PriceOutDTO';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent {

}
