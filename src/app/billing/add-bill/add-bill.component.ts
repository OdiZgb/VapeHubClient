import { AfterViewChecked, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable, map, startWith } from 'rxjs';
import { EmployeeDTO } from 'src/app/DTOs/EmployeeDTO';
import { BillDTO } from 'src/app/DTOs/BillDTO';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { PriceOutDTO } from 'src/app/DTOs/PriceOutDTO';
import { TraderDTO } from 'src/app/DTOs/TraderDTO';
import { MainSeviceService } from 'src/app/main-sevice.service';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';
import { PriceService } from 'src/app/services/PriceService/price.service';
import { BillsService } from 'src/app/services/bills/bills.service';
import { ClientDTO } from 'src/app/DTOs/ClientDTO';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss']
})
export class AddBillComponent implements AfterViewChecked  {
  foundItem!: ItemDTO;
  foundClient!: ClientDTO;
  foundEmployee!: EmployeeDTO;

  myForm!: FormGroup;
  ProductController = new FormControl('');
  ClientController = new FormControl(''); 
  EmployeeController = new FormControl(''); 
  itemNames: Map<number, string> = new Map<number, string>();
  clientNames: Map<number, string> = new Map<number, string>();
  employeeNames: Map<number, string> = new Map<number, string>();
  constItemNames: Map<number, string> = new Map<number, string>();
  constEmployeeNames: Map<number, string> = new Map<number, string>();
  constClientNames: Map<number, string> = new Map<number, string>();
  ItemDTOs:ItemDTO[]=[];
  clientDTOs:ClientDTO[]=[];
  employeeDTOs:EmployeeDTO[]=[];
  filteredOptions!: Observable<string[]>;
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  foundProduct: boolean = false;
  foundItemId: number= -1;
  isFoundClient: boolean = false;
  isFoundEmployee: boolean = false;
  foundClientId: number= -1;
  foundEmployeeId: number= -1;
  itemControllerCounter = 0;
  foundItems: number[] =[];
  @ViewChildren('barcodeInput')
  matInputs!: QueryList<MatInput>;
  constructor(private mainsService: MainSeviceService,private formBuilder: FormBuilder,public billService:BillsService, private itemService: ItemListService, private messageService: MessageService) {}
  ngAfterViewChecked(): void {
    if (this.newControlAdded) {
       this.newControlAdded = false;
    }
  }
   a:string[]=[];
   newControlAdded = false;
  ngOnInit(): void {
    this.mainsService.clientService.getAllClients$().subscribe(x => {
      this.clientDTOs = x;
      x.forEach(client => {
        if(client.id !== null && client.name !== null) {
          this.clientNames.set(client.id, client.name);
          this.constClientNames.set(client.id, client.name);
        }
      });
    });
    this.mainsService.employeeService.getAllEmployees$().subscribe(x => {
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
      clientName: this.ClientController,
      employeeName: this.EmployeeController,
      priceOut: ['', [Validators.required, Validators.minLength(1)]],
      requierdPrice: ['', [Validators.required, Validators.minLength(1)]],
      paiedPrice: ['', [Validators.required, Validators.minLength(1)]],
      controls: this.formBuilder.array([])

    });
    this.addControl()
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
    
    this.ClientController.valueChanges.subscribe(x => {
      let foundClientByName = this.clientDTOs.find(s => s.name == x);
    
      if (foundClientByName != null && foundClientByName.id != null) {
        this.isFoundClient = true;
        this.foundClientId = foundClientByName.id;
      } else if (x == null || x == '') {
        this.clientNames = new Map(this.constClientNames);
        return;
      }
    
      this.fiterDataClient(x);
      console.log(x, "client change");
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
      console.log(x, "client change");
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
 
  addControl() {
    this.foundProduct = false;
    this.foundItemId = -1;
    this.itemService.getAllItemsList$().subscribe(
      x => {
        this.ItemDTOs=x;
        x.forEach(element => {

          this.itemNames.set(element.id, element.name);
          this.constItemNames.set(element.id, element.name);
        });
        
    let controls = this.myForm?.get('controls') as FormArray;
    const controlName = 'itemController' + this.itemControllerCounter;
    this.myForm.addControl(controlName, this.formBuilder.control(''));
    const newControl = this.myForm.get(controlName);
    if (newControl) {
      controls.push(newControl);
    }
    this.itemControllerCounter = this.itemControllerCounter + 1;
    console.log(controls);
    newControl?.valueChanges.subscribe(
      x => {
        let foundItemByBarcode = this.ItemDTOs.find(s => s.name == x);
        
        if(foundItemByBarcode != null) {
          this.foundItems.push(foundItemByBarcode.id);
          this.foundProduct = true;
          this.foundItemId = foundItemByBarcode.id;
          this.newControlAdded = true;
          this.addControl();
          // this.ProductController.setValue(foundItemByBarcode.name); Remove this line
        }
    
        this.fiterDataBarcode(x);
        console.log(x,"ssschange");
    
        if(x == null || x?.length == 0){
          this.itemNames = this.constItemNames;
        }
      }
    );

      }
    );

  }

  get controls(): FormArray {
    return this.myForm.get('controls') as FormArray;
  }

  onSubmit(): void {
    if (this.myForm?.valid) {
      const barcodeValue = this.myForm.get('barcodeName')?.value;
      const clientValue = this.myForm.get('clientName')?.value;
      const employeeValue = this.myForm.get('employeeName')?.value;
      const priceOutValue = this.foundItem.priceOutDTO?.price;
      const requierdPriceValue = this.myForm.get('requierdPrice')?.value;
      const paiedPriceValue = this.myForm.get('paiedPrice')?.value;
 
      console.log('barcodeValue', barcodeValue);
      console.log('priceOutValue', priceOutValue);
      console.log('clientValue', clientValue);
      console.log('employeeValue', employeeValue);

 
      let itemsDTO: ItemDTO[] = [];
  
      this.controls.value.forEach((id: string) => {
        let itemDTO: ItemDTO = {
          id: this.getKeyFromValueBarcode(id),
        }as ItemDTO;
  
        itemsDTO.push(itemDTO);
      });

      let items:ItemDTO[] = [];
      this.foundItems.forEach(element => {
        items.push({id:element} as ItemDTO)
      });

      let billDTO: BillDTO = {
        clientId: this.foundClientId,
        employeeId: this.foundEmployeeId,
        requierdPrice: Number.parseInt(requierdPriceValue),
        paiedPrice: Number.parseInt(paiedPriceValue),
        exchangeRepaied: 0,
        id: 0,
        clientDebtId: 0,
        completed: false,
        time: '',
        employee: null,
        client: null,
        clientDebt: null,
      items: items
      } ;

      this.billService.addToBill(billDTO).subscribe(
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
  this.myForm.controls['priceOut'].setValue(this.foundItem?.priceOutDTO?.price + "₪")

  }
  onOptionSelectedClient(event: any): void {
    const selectedValue = event.option.value;
    const selectedKey = this.getKeyFromValueClient(selectedValue);
    console.log('Selected Key:', selectedKey);
  
    this.isFoundClient = true;
    this.foundClientId = selectedKey || -1;
    // Assign the selected key to a variable or perform any other logic
    this.clientDTOs.forEach(client => {
      if(client.id==this.foundClientId){
        this.foundClient = client;
        console.log("this is the found item",client)
      }
  });
  this.myForm.controls['priceOut'].setValue(this.foundItem?.priceOutDTO?.price + "₪")

  }
  onOptionSelectedEmployee(event: any): void {
    const selectedValue = event.option.value;
    const selectedKey = this.getKeyFromValueEmployee(selectedValue);
    console.log('Selected Key:', selectedKey);
  
    this.isFoundEmployee = true;
    this.foundEmployeeId = selectedKey || -1;
    // Assign the selected key to a variable or perform any other logic
    this.employeeDTOs.forEach(employee => {
      if(employee.id==this.foundClientId){
        this.foundEmployee = employee;
        console.log("this is the found item",employee)
      }
  });
  this.myForm.controls['priceOut'].setValue(this.foundItem?.priceOutDTO?.price + "₪")

  }
  getKeyFromValueBarcode(value: string): number | undefined {
    const entry = Array.from(this.itemNames.entries()).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined;
  }
  getKeyFromValueClient(value: string): number | undefined {
    const entry = Array.from(this.clientNames.entries()).find(([key, val]) => val === value);
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
fiterDataClient(x: string | null): void {
  if (x == null || x == '') {
      this.clientNames = new Map(this.constClientNames);
      return;
  }
  let Names: Map<number, string> = new Map<number, string>();

  this.clientNames?.forEach((val, k) => {
      if (val?.toLocaleLowerCase().includes(x?.toLocaleLowerCase())) {
          Names.set(k, val);
      }
  });
  this.clientNames = Names;
  console.log(x, "this is the same");
}
}

/*{
  ="id": 0,
  ="itemId": 32,
  ="requierdPrice": 1,
  ="paiedPrice": 10,
  ="exchangeRepaied": 18,
  "arrivalDate": "2023-06-25T12:23:04.009Z",
  "manufacturingDate": "2023-06-25T12:23:04.009Z",
  "expirationDate": "2023-06-25T12:23:04.009Z"
}
*/
