import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, map, startWith } from 'rxjs';
import { InventoryDTO } from 'src/app/DTOs/InventoryDTO';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { PriceInDTO } from 'src/app/DTOs/PriceInDTO';
import { PriceOutDTO } from 'src/app/DTOs/PriceOutDTO';
import { MainSeviceService } from 'src/app/main-sevice.service';
import { InventoryService } from 'src/app/services/InventoryService/inventory.service';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';
import { PriceService } from 'src/app/services/PriceService/price.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AppStore } from 'src/app/AppStore/AppStore';
@Component({
  selector: 'app-add-shipment-dialog',
  templateUrl: './add-shipment-dialog.component.html',
  styleUrls: ['./add-shipment-dialog.component.scss']
})
export class AddShipmentDialogComponent {
 
  foundItem!: ItemDTO;
  IsAddItemActive = false;
  myForm!: FormGroup;
  ProductController = new FormControl('');
  itemNames: Map<number, string> = new Map<number, string>();
  constItemNames: Map<number, string> = new Map<number, string>();
  ItemDTOs: ItemDTO[] = [];
  filteredOptions!: Observable<string[]>;
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  foundProduct: boolean = false;
  foundItemId: number = -1;
  InventoryDTOs: InventoryDTO[] = [];
   constNames: Map<number, string> = new Map<number, string>();
 
  constructor(public store$:AppStore,public dialogRef: MatDialogRef<AddShipmentDialogComponent>,
    private cdr: ChangeDetectorRef,public ref: DynamicDialogRef, private formBuilder: FormBuilder, public inventoryService: InventoryService, private itemService: ItemListService, private messageService: MessageService) { }
  a: string[] = [];

  ngOnInit(): void {
    this.itemService.getAllItemsList$().subscribe(
      x => {
        this.ItemDTOs = x;
        x.forEach(element => {
          this.itemNames.set(element.id, element.name);
          this.constItemNames.set(element.id, element.name);
        });
        this.cdr.detectChanges();
      }
    );

    this.myForm = this.formBuilder.group({
      barcodeName: this.ProductController,
      priceIn: ['', [Validators.required, Validators.minLength(1)]],
      numberOfUnits: ['', [Validators.required, Validators.minLength(1)]],
      expirationDate: ['', [Validators.required, Validators.minLength(1)]],
    });
    this.ProductController.valueChanges.subscribe(
      x => {
        let foundItemByBarcode = this.ItemDTOs.find(s => s.barcode == x);

        if (foundItemByBarcode != null) {
          this.foundProduct = true;
          this.foundItemId = foundItemByBarcode.id;
        }

        this.fiterDataBarcode(x);

        if (x == null || x?.length == 0) {
          this.itemNames = this.constItemNames;
        }
      }
    );
    this.itemService.getAllItemsList$().subscribe(
      x => {
        this.ItemDTOs=x;
        x.forEach(element => {
          this.itemNames.set(element.id, element.name);
          this.constNames.set(element.id, element.name);
        });
      }
    );
 
    this.ProductController.valueChanges.subscribe(
      x=>{
        let foundItemByBarcode = this.ItemDTOs.find(s=>s.barcode==x)
        if(foundItemByBarcode!=null){
          this.foundProduct=true;
          this.foundItemId=foundItemByBarcode.id;
          this.ProductController.setValue(foundItemByBarcode.name);
        }
        this.fiterData(x);
      if(x==null||x?.length==0){
        this.itemNames=this.constNames
      }
      }
    );
    }

  fiterDataBarcode(x: string | null): void {
    if (x == null) {
      return;
    }

    let Names: Map<number, string> = new Map<number, string>();

    this.itemNames?.forEach((val, k) => {
      if (val?.toLocaleLowerCase().includes(x?.toLocaleLowerCase())) {
        Names.set(k, val);
      }
    });

    this.itemNames = Names;
  }


  onSubmit(): void {
    if (this.myForm?.valid) {
      const barcodeValue = this.myForm.get('barcodeName')?.value;
      const priceInValue = this.foundItem.priceInDTO?.price;
      const numberOfUnitsValue = this.myForm.get('numberOfUnits')?.value;
      const expirationDateValue = this.myForm.get('expirationDate')?.value;
      this.cdr.detectChanges();


      let inventoryDTO: InventoryDTO = {
        itemId: this.foundItem.id,
        numberOfUnits: Number.parseInt(numberOfUnitsValue),
        priceInId: this.foundItem.priceInDTO?.id,
        expirationDate: expirationDateValue
      } as InventoryDTO;

      this.cdr.detectChanges();
      this.store$.setState((state) => {
        return { ...state, AddedShipmentToInventory: [...state.AddedShipmentToInventory, inventoryDTO] };
      });
      this.dialogRef.close();
    } else {

    }
  }
 
  addItem() {
    if (this.myForm?.valid) {
      const barcodeValue = this.myForm.get('barcodeName')?.value;
      const priceInValue = this.foundItem.priceInDTO?.price;
      const numberOfUnitsValue = this.myForm.get('numberOfUnits')?.value;
      const expirationDateValue = this.myForm.get('expirationDate')?.value;

      let inventoryDTO: InventoryDTO = {
        itemId: this.foundItem.id,
        itemDTO : this.foundItem,
        numberOfUnits: Number.parseInt(numberOfUnitsValue),
        priceInId: this.foundItem.priceInDTO?.id,
        expirationDate: expirationDateValue
      } as InventoryDTO;
      
      this.InventoryDTOs.push(inventoryDTO);
    }
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
  }

  onOptionSelected(event: any): void {
    const selectedValue = event.option.value;
    const selectedKey = this.getKeyFromValue(selectedValue);
    this.foundProduct=true;
    this.foundItemId=selectedKey || -1;
    this.ItemDTOs.forEach(item => {
      if (item.id == this.foundItemId) {
        this.foundItem = item;
      }
    });

    this.myForm.controls['priceIn'].setValue(this.foundItem.priceInDTO?.price + "₪")
  }
  getKeyFromValue(value: string): number | undefined {
    const entry = Array.from(this.itemNames.entries()).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined;
  }
}
