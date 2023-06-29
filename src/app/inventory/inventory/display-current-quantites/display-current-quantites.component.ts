import { Component } from '@angular/core';
import { InventoryDTO } from 'src/app/DTOs/InventoryDTO';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { ItemQuantityDTO } from 'src/app/DTOs/ItemQuantityDTO';
import { InventoryService } from 'src/app/services/InventoryService/inventory.service';

@Component({
  selector: 'app-display-current-quantites',
  templateUrl: './display-current-quantites.component.html',
  styleUrls: ['./display-current-quantites.component.scss']
})
export class DisplayCurrentQuantitesComponent {
  itemQuantityDTO!: ItemQuantityDTO[];

  selectedCustomers!: InventoryDTO[];

  representatives!: ItemDTO[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
  this.inventoryService.getCurrentQuantites$().subscribe((customers) => {
    this.itemQuantityDTO = customers;
    this.loading = false;
    
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
}
