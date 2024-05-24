import { Component, OnInit } from '@angular/core';
import { BillsService } from 'src/app/services/bills/bills.service';
import { HistoryOfCashBill } from 'src/app/DTOs/HistoryOfCashBill';

@Component({
  selector: 'app-cash-bill-history',
  templateUrl: './cash-bill-history.component.html',
  styleUrls: ['./cash-bill-history.component.scss']
})
export class CashBillHistoryComponent implements OnInit {
  cashBills: HistoryOfCashBill[] = [];
  groupedBills: { [key: number]: HistoryOfCashBill[] } = {};
  billKeys: number[] = [];
  loading: boolean = true;
  searchText: string = '';

  constructor(private billsService: BillsService) { }

  ngOnInit(): void {
    this.loadCashBills();
  }

  loadCashBills(): void {
    this.billsService.GetCash$().subscribe((data: HistoryOfCashBill[]) => {
      this.cashBills = data.sort((a, b) => (b.billId ?? 0) - (a.billId ?? 0));
      this.groupBillsByBillId();
      this.loading = false;
    });
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
    this.billKeys = Object.keys(this.groupedBills).map(key => +key);
  }

  clear() {
    this.searchText = '';
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
      this.billKeys = Object.keys(this.groupedBills).map(key => +key);
    } else {
      this.groupBillsByBillId();
    }
  }
}
