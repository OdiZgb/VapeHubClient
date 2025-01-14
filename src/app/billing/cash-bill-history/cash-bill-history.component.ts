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
  years: number[] = [];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedDate: FormControl = new FormControl(null);
  selectedYear: number | null = null;
  selectedMonth: number | null = null;

  constructor(private billsService: BillsService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadCashBills();
    this.generateYears();
  }
  formatDateTime(dateTime: Date): string {
    return formatDate(dateTime, 'dd/MM/yyyy HH:mm', 'en-US');
  }
  
  calculateTotalPrice(bills: HistoryOfCashBill[]): number {
    return bills.reduce((total, bill) => total + (bill.itemCostOut || 0), 0);
  }
  loadCashBills(): void {
    this.billsService.GetCash$().subscribe((data: HistoryOfCashBill[]) => {
      console.log('Raw Cash Bills:', data);  // Debugging the raw data returned by the API
      const filteredBills = this.filterOutSoftDeletedBills(data);
      console.log('Filtered Cash Bills:', filteredBills); // Check filtered bills
      this.cashBills = filteredBills;
      this.generateYears();  // Call generateYears after setting cashBills
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
  groupBillsByBillId(filteredBills: HistoryOfCashBill[] = this.cashBills): void {
    this.groupedBills = filteredBills.reduce((acc, bill) => {
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
    let filteredBills = this.cashBills;

    if (this.selectedYear) {
      filteredBills = filteredBills.filter(bill =>
        new Date(bill.dateTime).getFullYear() === this.selectedYear
      );
    }

    if (this.selectedMonth !== null) {
      filteredBills = filteredBills.filter(bill =>
        new Date(bill.dateTime).getMonth() === this.selectedMonth
      );
    }

    if (this.selectedDate.value) {
      const formattedDate = formatDate(this.selectedDate.value, 'dd/MM/yyyy', 'en-US');
      filteredBills = filteredBills.filter(bill =>
        formatDate(bill.dateTime, 'dd/MM/yyyy', 'en-US') === formattedDate
      );
    }

    this.groupBillsByBillId(filteredBills);
  }
// Get total price of the filtered bills
getTotalPrice(): number {
  // Flatten the groupedBills into a single array of bills and then calculate the total
  const visibleBills = Object.values(this.groupedBills).flat();
  return visibleBills.reduce((total, bill) => total + (bill.itemCostOut || 0), 0);
}

generateYears(): void {
  const allYears = this.cashBills
    .map(bill => new Date(bill.dateTime))
    .filter(date => !isNaN(date.getTime())) // Ensure the date is valid
    .map(date => date.getFullYear());
  this.years = Array.from(new Set(allYears)).sort();
}

// Get the number of filtered bills
getNumberOfBills(): number {
  // Flatten the groupedBills to count the visible bills
  const visibleBills = Object.values(this.groupedBills).flat();
  return visibleBills.length;
}

}
