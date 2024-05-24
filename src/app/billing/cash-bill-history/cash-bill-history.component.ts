import { Component, OnInit } from '@angular/core';
import { BillsService } from 'src/app/services/bills/bills.service';
import { HistoryOfCashBill } from 'src/app/DTOs/HistoryOfCashBill';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cash-bill-history',
  templateUrl: './cash-bill-history.component.html',
  styleUrls: ['./cash-bill-history.component.scss'],
  providers: [MessageService]
})
export class CashBillHistoryComponent implements OnInit {
  cashBills: HistoryOfCashBill[] = [];
  groupedBills: { [key: number]: HistoryOfCashBill[] } = {};
  billKeys: number[] = [];
  loading: boolean = true;
  searchText: string = '';
  selectedBills: HistoryOfCashBill[] = [];

  constructor(private billsService: BillsService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadCashBills();
  }

  loadCashBills(): void {
    this.billsService.GetCash$().subscribe((data: HistoryOfCashBill[]) => {
      // Filter out bills that have any items with SoftDeleted set to 1
      const filteredBills = this.filterOutSoftDeletedBills(data);
      this.cashBills = filteredBills;
      this.groupBillsByBillId();
      this.loading = false;
    });
  }

  filterOutSoftDeletedBills(data: HistoryOfCashBill[]): HistoryOfCashBill[] {
    const billsGroupedById = data.reduce((acc, bill) => {
      const billId = bill.billId ?? 0;
      if (!acc[billId]) {
        acc[billId] = [];
      }
      acc[billId].push(bill);
      return acc;
    }, {} as { [key: number]: HistoryOfCashBill[] });

    return Object.values(billsGroupedById)
      .filter(bills => !bills.some(bill => bill.SoftDeleted === 1))
      .flat();
  }

  groupBillsByBillId(): void {
    this.groupedBills = this.cashBills.reduce((acc, bill) => {
      const billId = bill.billId ?? 0;
      if (!acc[billId]) {
        acc[billId] = [];
      }
      acc[billId].push(bill);
      return acc;
    }, {} as { [key: number]: HistoryOfCashBill[] });

    this.billKeys = Object.keys(this.groupedBills).map(key => +key).sort((a, b) => b - a);
  }

  clear() {
    this.searchText = '';
    this.filterData();
  }

  filterData() {
    if (this.searchText) {
      const filtered = this.cashBills.filter(bill =>
        bill.itemName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        bill.clientName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        bill.employeeName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        bill.barcode?.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.groupedBills = filtered.reduce((acc, bill) => {
        const billId = bill.billId ?? 0;
        if (!acc[billId]) {
          acc[billId] = [];
        }
        acc[billId].push(bill);
        return acc;
      }, {} as { [key: number]: HistoryOfCashBill[] });
      this.billKeys = Object.keys(this.groupedBills).map(key => +key).sort((a, b) => b - a);
    } else {
      this.groupBillsByBillId();
    }
  }

  deleteBill(billId: number): void {
    this.billsService.deleteCashBill$(billId).subscribe(() => {
      this.cashBills = this.cashBills.filter(bill => bill.billId !== billId);
      this.groupBillsByBillId();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bill deleted successfully' });

    },e=>{},()=>{      ;
    });
    setTimeout(() => {
      window.location.reload()
    }, 1100);
  }
}
