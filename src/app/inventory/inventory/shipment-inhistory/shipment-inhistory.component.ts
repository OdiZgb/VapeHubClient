import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryDTO } from 'src/app/DTOs/InventoryDTO';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { InventoryService } from 'src/app/services/InventoryService/inventory.service';
import {MatButtonModule} from '@angular/material/button'; 
import { MatDialog } from '@angular/material/dialog';
import { PrintBadcodesComponent } from './print-badcodes/print-badcodes.component';
@Component({
  selector: 'app-shipment-inhistory',
  templateUrl: './shipment-inhistory.component.html',
  styleUrls: ['./shipment-inhistory.component.scss']
})
export class ShipmentInhistoryComponent {
  inventories!: InventoryDTO[];
  buttonHovered: boolean = false;
  selectedCustomers!: InventoryDTO[];

  representatives!: ItemDTO[];

  statuses!: any[];
  showButton: boolean = false;
  loading: boolean = true;

  activityValues: number[] = [0, 100];
  inventoryItemBarcode: string | undefined;
  constructor(public dialog: MatDialog,private inventoryService: InventoryService, private router:Router) {}

  ngOnInit() {
  this.inventoryService.getAllInventory$().subscribe((customers) => {
    this.inventories = customers;
    this.loading = false;
    
    this.inventories.forEach((inventory) => (inventory.arrivalDate = new Date(<Date>inventory.arrivalDate)));
});
 
 
}

onRowClick(inventory: InventoryDTO) {
    this.router.navigate(['inventory/item/details/'+inventory.itemDTO?.barcode+'/' +inventory.barcode]);
  }
  calculateBarcode(inventory: any): string {
    return `${inventory.itemDTO.barcode}-${inventory.barcode}`;
  }

handleButtonClick(event: MouseEvent, barcode: string) {
  event.stopPropagation(); // Prevent the click event from propagating to the parent <tr> element
  console.warn("Button clicked!");
  localStorage.setItem("barcodeToPrint",barcode)
  this.dialog.open(PrintBadcodesComponent, {
  });
}
}
