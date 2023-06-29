import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { InventoryDTO } from 'src/app/DTOs/InventoryDTO';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { PriceInDTO } from 'src/app/DTOs/PriceInDTO';
import { PriceOutDTO } from 'src/app/DTOs/PriceOutDTO';
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

  myForm!: FormGroup;
  ProductController = new FormControl('');
  itemNames: Map<number, string> = new Map<number, string>();
  constNames: Map<number, string> = new Map<number, string>();
  ItemDTOs:ItemDTO[]=[];
  filteredOptions!: Observable<string[]>;
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  foundProduct: boolean = false;
  foundItemId: number= -1;

  constructor(private formBuilder: FormBuilder,public inventoryService:InventoryService,  private priceService: PriceService, private itemService: ItemListService) {}
   a:string[]=[];

  ngOnInit(): void {
    this.itemService.getAllItemsList$().subscribe(
      x => {
        this.ItemDTOs=x;
        x.forEach(element => {
          this.itemNames.set(element.id, element.name);
          this.constNames.set(element.id, element.name);
        });
      }
    );
 
    this.myForm = this.formBuilder.group({
      barcodeName: [''],
      priceIn: ['', [Validators.required, Validators.minLength(1)]],
      patchId: ['', [Validators.required, Validators.minLength(1)]],
      numberOfUnits: ['', [Validators.required, Validators.minLength(1)]],
      arrivalDate: ['', [Validators.required, Validators.minLength(1)]],
      manufacturingDate: ['', [Validators.required, Validators.minLength(1)]],
      expirationDate: ['', [Validators.required, Validators.minLength(1)]],
    });
    this.ProductController.valueChanges.subscribe(
      x=>{
        let foundItemByBarcode = this.ItemDTOs.find(s=>s.barcode==x)
        

        if(foundItemByBarcode!=null){
          this.foundProduct=true;
          this.foundItemId=foundItemByBarcode.id;
          this.ProductController.setValue(foundItemByBarcode.name);
        }
        this.fiterData(x);
        console.log(x,"ssschange");
      if(x==null||x?.length==0){
        this.itemNames=this.constNames

      }
      }
    );
  }
  fiterData(x: string | null): void {
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
      const priceInValue = this.foundItem.priceInDTO?.price;
      const patchIdValue = this.myForm.get('patchId')?.value;
      const numberOfUnitsValue = this.myForm.get('numberOfUnits')?.value;
      const arrivalDateValue = this.myForm.get('arrivalDate')?.value;
      const manufacturingDateValue = this.myForm.get('manufacturingDate')?.value;
      const expirationDateValue = this.myForm.get('expirationDate')?.value;

      console.log('barcodeValue', barcodeValue);
      console.log('priceInValue', priceInValue);

      let inventoryDTO: InventoryDTO = {
        itemId: this.foundItem.id,
        patchId: Number.parseInt(patchIdValue),
        numberOfUnits: Number.parseInt(numberOfUnitsValue),
        priceInId: this.foundItem.priceInDTO?.id,
        arrivalDate: arrivalDateValue,
        manufacturingDate: manufacturingDateValue,
        expirationDate: expirationDateValue
      } as InventoryDTO;

 
      this.inventoryService.addToInventory(inventoryDTO).subscribe(
        x => {
          alert("added");
        },
        error => {
          alert('Error adding PriceOut'+ error);
        }
      );

    } else {
      console.log('Form is invalid');
    }
  }
  onOptionSelected(event: any): void {
    const selectedValue = event.option.value;
    const selectedKey = this.getKeyFromValue(selectedValue);
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
  getKeyFromValue(value: string): number | undefined {
    const entry = Array.from(this.itemNames.entries()).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined;
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
