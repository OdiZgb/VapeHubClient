import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InventoryDTO } from 'src/app/DTOs/InventoryDTO';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { AppStore } from 'src/app/AppStore/AppStore';
import { InventoryService } from 'src/app/services/InventoryService/inventory.service';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-shipment-dialog',
  templateUrl: './add-shipment-dialog.component.html',
  styleUrls: ['./add-shipment-dialog.component.scss']
})
export class AddShipmentDialogComponent implements OnInit {

  foundItem!: ItemDTO;
  IsAddItemActive = false;
  myForm!: FormGroup;
  ProductController = new FormControl('');
  itemNames: Map<number, any> = new Map<number, any>();
  constItemNames: Map<number, any> = new Map<number, any>();
  ItemDTOs: ItemDTO[] = [];
  foundProduct: boolean = false;
  foundItemId: number = -1;
  InventoryDTOs: InventoryDTO[] = [];

  constructor(
    public store$: AppStore,
    public dialogRef: MatDialogRef<AddShipmentDialogComponent>,
    private cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    private formBuilder: FormBuilder,
    public inventoryService: InventoryService,
    private itemService: ItemListService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.itemService.getAllItemsList$().subscribe(x => {
      this.ItemDTOs = x;
      x.forEach(element => {
        this.itemNames.set(element.id, {
          name: element.name,
          category: element.categoryDTO?.name || 'Unknown Category',
          marka: element.markaDTO?.name || 'Unknown Marka'
        });
        this.constItemNames.set(element.id, {
          name: element.name,
          category: element.categoryDTO?.name || 'Unknown Category',
          marka: element.markaDTO?.name || 'Unknown Marka'
        });
      });
      this.cdr.detectChanges();
    });

    this.myForm = this.formBuilder.group({
      barcodeName: this.ProductController,
      priceIn: ['', [Validators.required, Validators.minLength(1)]],
      numberOfUnits: ['', [Validators.required, Validators.minLength(1)]],
      expirationDate: ['', [Validators.required, Validators.minLength(1)]],
    });

    this.ProductController.valueChanges.subscribe(x => {
      let foundItemByBarcode = this.ItemDTOs.find(s => s.barcode === x);

      if (foundItemByBarcode != null) {
        this.foundProduct = true;
        this.foundItemId = foundItemByBarcode.id;
      }

      this.filterData(x);

      if (x == null || x?.length === 0) {
        this.itemNames = this.constItemNames;
      }
    });
  }

  filterData(x: string | null): void {
    if (x == null) {
      return;
    }

    let filteredNames: Map<number, any> = new Map<number, any>();

    this.itemNames?.forEach((val, k) => {
      if (val.name?.toLocaleLowerCase().includes(x?.toLocaleLowerCase())) {
        filteredNames.set(k, val);
      }
    });

    this.itemNames = filteredNames;
  }

  onSubmit(): void {
    if (this.myForm?.valid) {
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
    }
  }

  onOptionSelected(event: any): void {
    const selectedValue = event.option.value;
    const selectedKey = this.getKeyFromValue(selectedValue);
    this.foundProduct = true;
    this.foundItemId = selectedKey || -1;
    this.ItemDTOs.forEach(item => {
      if (item.id == this.foundItemId) {
        this.foundItem = item;
      }
    });

    this.myForm.controls['priceIn'].setValue(this.foundItem.priceInDTO?.price + "₪");
  }

  getKeyFromValue(value: string): number | undefined {
    const entry = Array.from(this.itemNames.entries()).find(([key, val]) => val.name === value);
    return entry ? entry[0] : undefined;
  }
}
