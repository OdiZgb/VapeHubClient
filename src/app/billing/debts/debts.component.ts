import { ChangeDetectorRef, Component } from '@angular/core';
import { Table } from 'primeng/table';
import { ClientDebtDTO } from 'src/app/DTOs/ClientDebtDTO';
import { BillsService } from 'src/app/services/bills/bills.service';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss']
})
export class DebtsComponent {
  clientDebtDTO: ClientDebtDTO[] = [];
  loading: boolean = true;

  constructor(private billsService: BillsService, private cdRef:ChangeDetectorRef) {}

  ngOnInit() {
      this.billsService.getAllBills$().subscribe((debts) => {
        debts.forEach(element => {
          if(element.clientDebt!=null){
           this.clientDebtDTO.push(element.clientDebt);
          }
          });
          this.loading = false;
      });
  }

  clear(table: Table) {
      table.clear();
  }
  completeDebt(id:number){
    this.billsService.completeDebt$(id).subscribe(x => {
       // Refresh all data
      this.refreshData();
    });
  }
  refreshData() {
    this.loading = true; // Show loading indicator
    this.billsService.getAllBills$().subscribe((debts) => {
      this.clientDebtDTO = []; // Clear the old data
      debts.forEach(element => {
        if(element.clientDebt!=null){
         this.clientDebtDTO.push(element.clientDebt);
        }
        });
      this.loading = false; // Hide loading indicator
    });
  }
}
