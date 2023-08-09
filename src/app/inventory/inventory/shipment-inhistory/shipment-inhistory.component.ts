import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryDTO } from 'src/app/DTOs/InventoryDTO';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { InventoryService } from 'src/app/services/InventoryService/inventory.service';

@Component({
  selector: 'app-shipment-inhistory',
  templateUrl: './shipment-inhistory.component.html',
  styleUrls: ['./shipment-inhistory.component.scss']
})
export class ShipmentInhistoryComponent {
  inventories!: InventoryDTO[];

  selectedCustomers!: InventoryDTO[];

  representatives!: ItemDTO[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  constructor(private inventoryService: InventoryService, private router:Router) {}

  ngOnInit() {
  this.inventoryService.getAllInventory$().subscribe((customers) => {
    this.inventories = customers;
    this.loading = false;
    
    this.inventories.forEach((inventory) => (inventory.arrivalDate = new Date(<Date>inventory.arrivalDate)));
});
 

this.statuses = [
    { label: 'Unqualified', value: 'unqualified' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'New', value: 'new' },
    { label: 'Negotiation', value: 'negotiation' },
    { label: 'Renewal', value: 'renewal' },
    { label: 'Proposal', value: 'proposal' }
];
}
public getSeverity(status: string) {
  switch (status) {
      case 'unqualified':
          return 'danger';
      case 'qualified':
          return 'success';
      case 'new':
          return 'info';
      case 'negotiation':
          return 'warning';
      case 'renewal':
          return null;
      default:
          return 'unknown'; // or any other default value
  }

}
onRowClick(inventory: InventoryDTO) {
    this.router.navigate(['inventory/item/details/'+inventory.itemDTO?.barcode+'/' +inventory.barcode]);
  }
}
