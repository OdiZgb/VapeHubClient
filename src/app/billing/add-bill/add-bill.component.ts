import { AfterViewChecked, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
  ChangeBackController = new FormControl(''); 
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
  Items: ItemDTO[]   = [];
  totalCost: number = 0 ;
  @ViewChild('barcodeInput')
  barcodeInput!: ElementRef;
  constructor(private mainsService: MainSeviceService,private formBuilder: FormBuilder,public billService:BillsService, private itemService: ItemListService, private messageService: MessageService) {}
  ngAfterViewChecked(): void {

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
        if(employee.user.id !== null && employee.user.name !== null) {
          this.employeeNames.set(employee.user.id, employee.user.name);
          this.constEmployeeNames.set(employee.user.id, employee.user.name);
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
      changeBack: this.ChangeBackController,
      paiedPrice: ['', [Validators.required, Validators.minLength(1)]],
      controls: this.formBuilder.array([], [ Validators.minLength(0)])
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
    });
    this.EmployeeController.valueChanges.subscribe(x => {
      let foundEmployeeByName = this.employeeDTOs.find(s => s.user.name == x);
    
      if (foundEmployeeByName != null && foundEmployeeByName.id != null) {
        this.isFoundEmployee = true;
        this.foundEmployeeId = foundEmployeeByName.id;
      } else if (x == null || x == '') {
        this.employeeNames = new Map(this.constEmployeeNames);
        return;
      }
    
      this.fiterDataEmployee(x);
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
    this.myForm.addControl(controlName, this.formBuilder.control('', [ Validators.minLength(0)]));

    const newControl = this.myForm.get(controlName);
    if (newControl) {
      controls.removeAt(0);
      controls.removeAt(1);
      controls.push(newControl);

    }

    this.itemControllerCounter = this.itemControllerCounter + 1;
    newControl?.reset();
    
    newControl?.valueChanges.subscribe(
      x => {
      this.barcodeInput.nativeElement.focus();
      let foundItemByBarcode = this.ItemDTOs?.find(s => s?.barcode?.substring(0, 3) == x.substring(0, 3));
      if(!foundItemByBarcode){
          foundItemByBarcode = this.ItemDTOs?.find(s => s?.name == x);
        }
        if(foundItemByBarcode != null) {
          newControl.reset();

        this.Items.push(foundItemByBarcode);
        this.totalCost = 0;
        this.Items.forEach(element => {
          if(element.priceOutDTO?.price){
            this.totalCost = this.totalCost + element.priceOutDTO.price;
          }
        });
        this.myForm.get('paiedPrice')?.valueChanges.subscribe(x=>{
          let  paiedPriceValue = this.myForm.get('paiedPrice')?.value;
          let shouldRetrurn =  paiedPriceValue - this.totalCost 
         this.ChangeBackController.setValue(shouldRetrurn+'');
        
        })
 


           this.foundItems.push(foundItemByBarcode.id);
          this.foundProduct = true;
          this.foundItemId = foundItemByBarcode.id;
          this.newControlAdded = true;
          this.addControl();
      this.barcodeInput.nativeElement.focus();

          // this.ProductController.setValue(foundItemByBarcode.name); Remove this line
        }
        this.barcodeInput.nativeElement.focus();
    
        this.fiterDataBarcode(x);
        this.barcodeInput.nativeElement.focus();
    
        if(x == null || x?.length == 0){
          this.itemNames = this.constItemNames;
        }
      this.barcodeInput.nativeElement.focus();

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
      const changeBackValue =  this.myForm.get('changeBack')?.value;
      const paiedPriceValue = this.myForm.get('paiedPrice')?.value;

 
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
        requierdPrice: this.totalCost,
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
        }
      );

    } else {
    }
  }
  onOptionSelectedBarcode(event: any): void {
    const selectedValue = event.option.value;
    const selectedKey = this.getKeyFromValueBarcode(selectedValue);

    this.foundProduct=true;
    this.foundItemId=selectedKey || -1;
    // Assign the selected key to a variable or perform any other logic
    this.ItemDTOs.forEach(item => {
      if(item.id==this.foundItemId){
        this.foundItem = item;
      }
  });

  }
  onOptionSelectedClient(event: any): void {
    const selectedValue = event.option.value;
    const selectedKey = this.getKeyFromValueClient(selectedValue);
  
    this.isFoundClient = true;
    this.foundClientId = selectedKey || -1;
    // Assign the selected key to a variable or perform any other logic
    this.clientDTOs.forEach(client => {
      if(client.id==this.foundClientId){
        this.foundClient = client;
      }
  });
 
  }
  onOptionSelectedEmployee(event: any): void {
    const selectedValue = event.option.value;
    const selectedKey = this.getKeyFromValueEmployee(selectedValue);
  
    this.isFoundEmployee = true;
    this.foundEmployeeId = selectedKey || -1;
    // Assign the selected key to a variable or perform any other logic
    this.employeeDTOs.forEach(employee => {
      if(employee.user.id==this.foundClientId){
        this.foundEmployee = employee;
      }
  });
 
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
