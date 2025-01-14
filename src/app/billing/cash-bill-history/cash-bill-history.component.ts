import { Component, OnInit } from '@angular/core';
import { BillsService } from 'src/app/services/bills/bills.service';
import { HistoryOfCashBill } from 'src/app/DTOs/HistoryOfCashBill';
import { MessageService } from 'primeng/api';
import { formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';

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
  selectedDate: FormControl = new FormControl(null); // Holds the selected date
  constructor(private billsService: BillsService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadCashBills();
  }
  formatDateTime(dateTime: Date): string {
    return formatDate(dateTime, 'dd/MM/yyyy HH:mm', 'en-US');
  }
  
  calculateTotalPrice(bills: HistoryOfCashBill[]): number {
    return bills.reduce((total, bill) => total + (bill.itemCostOut || 0), 0);
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

  filterByDate(): void {
    const date = this.selectedDate.value;

    if (date) {
      const formattedDate = formatDate(date, 'dd/MM/yyyy', 'en-US');
      const filtered = this.cashBills.filter(bill =>
        formatDate(bill.dateTime, 'dd/MM/yyyy', 'en-US') === formattedDate
      );

      // Group the filtered bills
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
      // Reset to show all bills if no date is selected
      this.groupBillsByBillId();
    }
  }
// Get total price of the filtered bills
getTotalPrice(): number {
  // Flatten the groupedBills into a single array of bills and then calculate the total
  const visibleBills = Object.values(this.groupedBills).flat();
  return visibleBills.reduce((total, bill) => total + (bill.itemCostOut || 0), 0);
}

// Get the number of filtered bills
getNumberOfBills(): number {
  // Flatten the groupedBills to count the visible bills
  const visibleBills = Object.values(this.groupedBills).flat();
  return visibleBills.length;
}
}
