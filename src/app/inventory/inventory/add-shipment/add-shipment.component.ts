import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable, map, startWith } from 'rxjs';
import { EmployeeDTO } from 'src/app/DTOs/EmployeeDTO';
import { InventoryDTO } from 'src/app/DTOs/InventoryDTO';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { PriceInDTO } from 'src/app/DTOs/PriceInDTO';
import { PriceOutDTO } from 'src/app/DTOs/PriceOutDTO';
import { TraderDTO } from 'src/app/DTOs/TraderDTO';
import { MainSeviceService } from 'src/app/main-sevice.service';
import { InventoryService } from 'src/app/services/InventoryService/inventory.service';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';
import { PriceService } from 'src/app/services/PriceService/price.service';

@Component({
  selector: 'app-add-shipment',
  templateUrl: './add-shipment.component.html',
  styleUrls: ['./add-shipment.component.scss']
})

export class AddShipmentComponent {
  foundItem!: ItemDTO;
  foundTrader!: TraderDTO;
  foundEmployee!: EmployeeDTO;

  myForm!: FormGroup;
  ProductController = new FormControl('');
  TraderController = new FormControl(''); 
  EmployeeController = new FormControl(''); 
  itemNames: Map<number, string> = new Map<number, string>();
  traderNames: Map<number, string> = new Map<number, string>();
  employeeNames: Map<number, string> = new Map<number, string>();
  constItemNames: Map<number, string> = new Map<number, string>();
  constEmployeeNames: Map<number, string> = new Map<number, string>();
  constTraderNames: Map<number, string> = new Map<number, string>();
  ItemDTOs:ItemDTO[]=[];
  traderDTOs:TraderDTO[]=[];
  employeeDTOs:EmployeeDTO[]=[];
  filteredOptions!: Observable<string[]>;
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  foundProduct: boolean = false;
  foundItemId: number= -1;
  isFoundTrader: boolean = false;
  isFoundEmployee: boolean = false;
  foundTraderId: number= -1;
  foundEmployeeId: number= -1;

  constructor(private mainsService: MainSeviceService,private formBuilder: FormBuilder,public inventoryService:InventoryService, private itemService: ItemListService, private messageService: MessageService) {}
   a:string[]=[];

  ngOnInit(): void {
    this.mainsService.traders.subscribe(x => {
      this.traderDTOs = x;
      x.forEach(trader => {
        if(trader.id !== null && trader.name !== null) {
          this.traderNames.set(trader.id, trader.name);
          this.constTraderNames.set(trader.id, trader.name);
        }
      });
    });
    this.mainsService.employees.subscribe(x => {
      this.employeeDTOs = x;
      x.forEach(employee => {
        if(employee.id !== null && employee.name !== null) {
          this.employeeNames.set(employee.id, employee.name);
          this.constEmployeeNames.set(employee.id, employee.name);
        }
      });
    });
    this.itemService.getAllItemsList$().subscribe(
      x => {
        this.ItemDTOs=x;
        x.forEach(element => {
          this.itemNames.set(element.id, element.name);
          this.constItemNames.set(element.id, element.name);
        });
      }
    );
 
    this.myForm = this.formBuilder.group({
      barcodeName: this.ProductController,
      traderName: this.TraderController,
      employeeName: this.EmployeeController,
      priceIn: ['', [Validators.required, Validators.minLength(1)]],
      patchId: ['', [Validators.required, Validators.minLength(1)]],
      numberOfUnits: ['', [Validators.required, Validators.minLength(1)]],
      arrivalDate: ['', [Validators.required, Validators.minLength(1)]],
      expirationDate: ['', [Validators.required, Validators.minLength(1)]],
    });
    this.ProductController.valueChanges.subscribe(
      x => {
        let foundItemByBarcode = this.ItemDTOs.find(s => s.barcode == x);
        
        if(foundItemByBarcode != null) {
          this.foundProduct = true;
          this.foundItemId = foundItemByBarcode.id;
          // this.ProductController.setValue(foundItemByBarcode.name); Remove this line
        }
    
        this.fiterDataBarcode(x);
        console.log(x,"ssschange");
    
        if(x == null || x?.length == 0){
          this.itemNames = this.constItemNames;
        }
      }
    );
    
    this.TraderController.valueChanges.subscribe(x => {
      let foundTraderByName = this.traderDTOs.find(s => s.name == x);
    
      if (foundTraderByName != null && foundTraderByName.id != null) {
        this.isFoundTrader = true;
        this.foundTraderId = foundTraderByName.id;
      } else if (x == null || x == '') {
        this.traderNames = new Map(this.constTraderNames);
        return;
      }
    
      this.fiterDataTrader(x);
      console.log(x, "trader change");
    });
    this.EmployeeController.valueChanges.subscribe(x => {
      let foundEmployeeByName = this.employeeDTOs.find(s => s.name == x);
    
      if (foundEmployeeByName != null && foundEmployeeByName.id != null) {
        this.isFoundEmployee = true;
        this.foundEmployeeId = foundEmployeeByName.id;
      } else if (x == null || x == '') {
        this.employeeNames = new Map(this.constEmployeeNames);
        return;
      }
    
      this.fiterDataEmployee(x);
      console.log(x, "trader change");
    });
  }
  fiterDataBarcode(x: string | null): void {
    if(x==null){
      return;
    }
  let Names: Map<number, string> = new Map<number, string>();

    this.itemNames?.forEach((val,k) => {
      if(val?.toLocaleLowerCase().includes(x?.toLocaleLowerCase())){
        Names.set(k,val);
      }
    });
    this.itemNames=Names;
    console.log(x,"this is the same");
  }
 

  onSubmit(): void {
    if (this.myForm?.valid) {
      const barcodeValue = this.myForm.get('barcodeName')?.value;
      const traderValue = this.myForm.get('traderName')?.value;
      const employeeValue = this.myForm.get('employeeName')?.value;
      const priceInValue = this.foundItem.priceInDTO?.price;
      const patchIdValue = this.myForm.get('patchId')?.value;
      const numberOfUnitsValue = this.myForm.get('numberOfUnits')?.value;
      const arrivalDateValue = this.myForm.get('arrivalDate')?.value;
      const expirationDateValue = this.myForm.get('expirationDate')?.value;

      console.log('barcodeValue', barcodeValue);
      console.log('priceInValue', priceInValue);
      console.log('traderValue', traderValue);
      console.log('employeeValue', employeeValue);

      let inventoryDTO: InventoryDTO = {
        itemId: this.foundItem.id,
        traderId: this.foundTraderId,
        employeeId: this.foundEmployeeId,
        patchId: Number.parseInt(patchIdValue),
        numberOfUnits: Number.parseInt(numberOfUnitsValue),
        priceInId: this.foundItem.priceInDTO?.id,
        arrivalDate: arrivalDateValue,
        expirationDate: expirationDateValue
      } as InventoryDTO;

 
      this.inventoryService.addToInventory(inventoryDTO).subscribe(
        x => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Shipment has been added'});

        },
        error => {
          alert('Error adding PriceOut'+ error);
        }
      );

    } else {
      console.log('Form is invalid');
    }
  }
  onOptionSelectedBarcode(event: any): void {
    const selectedValue = event.option.value;
    const selectedKey = this.getKeyFromValueBarcode(selectedValue);
    console.log('Selected Key:', selectedKey);

    this.foundProduct=true;
    this.foundItemId=selectedKey || -1;
    // Assign the selected key to a variable or perform any other logic
    this.ItemDTOs.forEach(item => {
      if(item.id==this.foundItemId){
        this.foundItem = item;
        console.log("this is the found item",item)
      }
  });
  this.myForm.controls['priceIn'].setValue(this.foundItem.priceInDTO?.price + "₪")

  }
  onOptionSelectedTrader(event: any): void {
    const selectedValue = event.option.value;
    const selectedKey = this.getKeyFromValueTrader(selectedValue);
    console.log('Selected Key:', selectedKey);
  
    this.isFoundTrader = true;
    this.foundTraderId = selectedKey || -1;
    // Assign the selected key to a variable or perform any other logic
    this.traderDTOs.forEach(trader => {
      if(trader.id==this.foundTraderId){
        this.foundTrader = trader;
        console.log("this is the found item",trader)
      }
  });
  this.myForm.controls['priceIn'].setValue(this.foundItem.priceInDTO?.price + "₪")

  }
  onOptionSelectedEmployee(event: any): void {
    const selectedValue = event.option.value;
    const selectedKey = this.getKeyFromValueEmployee(selectedValue);
    console.log('Selected Key:', selectedKey);
  
    this.isFoundEmployee = true;
    this.foundEmployeeId = selectedKey || -1;
    // Assign the selected key to a variable or perform any other logic
    this.employeeDTOs.forEach(employee => {
      if(employee.id==this.foundTraderId){
        this.foundEmployee = employee;
        console.log("this is the found item",employee)
      }
  });
  this.myForm.controls['priceIn'].setValue(this.foundItem.priceInDTO?.price + "₪")

  }
  getKeyFromValueBarcode(value: string): number | undefined {
    const entry = Array.from(this.itemNames.entries()).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined;
  }
  getKeyFromValueTrader(value: string): number | undefined {
    const entry = Array.from(this.traderNames.entries()).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined;
  }
  getKeyFromValueEmployee(value: string): number | undefined {
    const entry = Array.from(this.employeeNames.entries()).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined;
  }
  fiterDataEmployee(x: string | null): void {
    if (x == null || x == '') {
        this.employeeNames = new Map(this.constEmployeeNames);
        return;
    }
    let Names: Map<number, string> = new Map<number, string>();

    this.employeeNames?.forEach((val, k) => {
        if (val?.toLocaleLowerCase().includes(x?.toLocaleLowerCase())) {
            Names.set(k, val);
        }
    });
    this.employeeNames = Names;
    console.log(x, "this is the same");
}
fiterDataTrader(x: string | null): void {
  if (x == null || x == '') {
      this.traderNames = new Map(this.constTraderNames);
      return;
  }
  let Names: Map<number, string> = new Map<number, string>();

  this.traderNames?.forEach((val, k) => {
      if (val?.toLocaleLowerCase().includes(x?.toLocaleLowerCase())) {
          Names.set(k, val);
      }
  });
  this.traderNames = Names;
  console.log(x, "this is the same");
}
}

/*{
  ="id": 0,
  ="itemId": 32,
  ="patchId": 1,
  ="numberOfUnits": 10,
  ="priceInId": 18,
  "arrivalDate": "2023-06-25T12:23:04.009Z",
  "manufacturingDate": "2023-06-25T12:23:04.009Z",
  "expirationDate": "2023-06-25T12:23:04.009Z"
}
*/
