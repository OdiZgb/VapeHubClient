import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppStore } from 'src/app/AppStore/AppStore';
import { InventoryDTO } from 'src/app/DTOs/InventoryDTO';
import { DialogAnimationsExampleDialog } from 'src/app/Templates/dialog-animations-example-dialog/dialog-animations-example-dialog.component';
import { ProductEditDialogComponent } from 'src/app/items/edit-item/product-edit-dialog/product-edit-dialog.component';
import { InventoryService } from 'src/app/services/InventoryService/inventory.service';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';

@Component({
  selector: 'app-inventory-template',
  templateUrl: './inventory-template.component.html',
  styleUrls: ['./inventory-template.component.scss']
})
export class InventoryTemplateComponent {
  apiURL ='https://localhost:7260';

  barcode='';
  
  inventoryDTOs: InventoryDTO[]  = [] ;
  imageURL = '';
  constructor(private route: ActivatedRoute, private inventoryService: InventoryService,private cdRef: ChangeDetectorRef ,private router: Router, public store$:AppStore) { }
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.barcode = params.get('barcode') || "";
    });
    this.inventoryService.getInventoryImage$(this.barcode).subscribe(s=>{
       this.cdRef.detectChanges();

    })
    this.inventoryService.getAllInventoryByBarcode$(this.barcode).subscribe(x=>{
      this.inventoryDTOs = x;
      this.imageURL = this.apiURL+"/"+x[0].imagePath
    });


  }
  
}
