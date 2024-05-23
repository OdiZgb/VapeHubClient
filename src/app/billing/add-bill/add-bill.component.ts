import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MessageService } from 'primeng/api';
import { EmployeeDTO } from 'src/app/DTOs/EmployeeDTO';
import { BillDTO } from 'src/app/DTOs/BillDTO';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { MainSeviceService } from 'src/app/main-sevice.service';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';
import { BillsService } from 'src/app/services/bills/bills.service';
import { ClientDTO } from 'src/app/DTOs/ClientDTO';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss']
})
export class AddBillComponent implements OnInit, AfterViewInit {
  myForm!: FormGroup;
  ProductController = new FormControl('');
  ClientController = new FormControl('');
  EmployeeController = new FormControl('');
  ChangeBackController = new FormControl('');
  itemNames: Map<number, string> = new Map<number, string>();
  clientNames: Map<number, string> = new Map<number, string>();
  employeeNames: Map<number, string> = new Map<number, string>();
  constItemNames: Map<number, string> = new Map<number, string>();
  constEmployeeNames: Map<number, string> = new Map<number, string>();
  constClientNames: Map<number, string> = new Map<number, string>();
  ItemDTOs: ItemDTO[] = [];
  clientDTOs: ClientDTO[] = [];
  employeeDTOs: EmployeeDTO[] = [];
  foundProduct: boolean = false;
  Items: { item: ItemDTO, quantity: number, fullBarcode: string }[] = [] || null; // Updated to include quantity and full barcode
  totalCost: number = 0;
  totalQuantity: number = 0; // Added to track total quantity
  username: string | null = null;

  @ViewChild('barcodeInput') barcodeInput!: ElementRef;
  @ViewChild(MatAutocompleteTrigger) auto1Trigger!: MatAutocompleteTrigger;

  constructor(
    private mainsService: MainSeviceService,
    private formBuilder: FormBuilder,
    public billService: BillsService,
    private itemService: ItemListService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initializeData();
    this.initializeForm();
    this.setupCashToReturnUpdater();
  }

  ngAfterViewInit(): void {
    this.focusBarcodeInput();
    this.setEmployeeFromStorage();
  }

  initializeData(): void {
    this.mainsService.clientService.getAllClients$().subscribe(x => {
      this.clientDTOs = x;
      x.forEach(client => {
        if (client.id !== null && client.name !== null) {
          this.clientNames.set(client.id, client.name);
          this.constClientNames.set(client.id, client.name);
        }
      });
    });
    this.mainsService.employeeService.getAllEmployees$().subscribe(x => {
      this.employeeDTOs = x;
      x.forEach(employee => {
        if (employee.user.id !== null && employee.user.name !== null) {
          this.employeeNames.set(employee.user.id, employee.user.name);
          this.constEmployeeNames.set(employee.user.id, employee.user.name);
        }
      });
    });
    this.itemService.getAllItemsList$().subscribe(x => {
      this.ItemDTOs = x;
      x.forEach(element => {
        this.itemNames.set(element.id, element.name);
        this.constItemNames.set(element.id, element.name);
      });
    });
  }

  initializeForm(): void {
    this.myForm = this.formBuilder.group({
      barcodeName: this.ProductController,
      clientName: this.ClientController,
      employeeName: this.EmployeeController,
      changeBack: this.ChangeBackController,
      paiedPrice: ['', [Validators.required, Validators.minLength(1)]],
    });
    this.setupFormListeners();
  }

  setupFormListeners(): void {
    this.ProductController.valueChanges.subscribe(x => {
      this.fiterDataBarcode(x);
      if (x && x.length >= 0) {
        this.auto1Trigger.openPanel();
      }
    });

    this.ClientController.valueChanges.subscribe(x => {
      this.fiterDataClient(x);
    });

    this.EmployeeController.valueChanges.subscribe(x => {
      this.fiterDataEmployee(x);
    });
  }

  setupCashToReturnUpdater(): void {
    this.myForm.get('paiedPrice')?.valueChanges.subscribe(() => {
      this.updateChangeBack();
    });
  }

  setEmployeeFromStorage(): void {
    this.username = localStorage.getItem('username');
    if (this.username) {
      this.mainsService.employeeService.getAllEmployees$().subscribe(x => {
        const employee = x.find(e => e.user.name === this.username);
        if (employee) {
          this.EmployeeController.setValue(employee.user.name);
          this.EmployeeController.disable();
        }
      });
    }
  }

  onBarcodeScanned(): void {
    const bar = this.ProductController.value;
    const barcodeValue = this.ProductController.value;
    const barcodePrefix = barcodeValue?.substring(0, 3);
    const foundItemByBarcode = this.ItemDTOs.find(s => s.barcode === barcodePrefix);

    if (foundItemByBarcode != null) {
      const existingItem = this.Items.find(item => item.item.id === foundItemByBarcode.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.Items.push({ item: foundItemByBarcode, quantity: 1, fullBarcode: bar || "" });
      }

      this.calculateTotals();
      this.ProductController.reset();
      this.focusBarcodeInput();
      this.auto1Trigger.openPanel();
    }
  }

  focusBarcodeInput(): void {
    setTimeout(() => {
      this.barcodeInput.nativeElement.focus();
      this.auto1Trigger.openPanel();
    }, 0);
  }

  openAutoComplete(): void {
    this.auto1Trigger.openPanel();
  }

  onSubmit(): void {
    if (this.myForm?.valid) {
      const clientValue = this.myForm.get('clientName')?.value;
      const employeeValue = this.myForm.get('employeeName')?.value;
      const changeBackValue = this.myForm.get('changeBack')?.value;
      const paiedPriceValue = this.myForm.get('paiedPrice')?.value;

      let items: ItemDTO[] = [];
      this.Items.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          items.push({ id: item.item.id, barcode: item.fullBarcode } as ItemDTO);
        }
      });

      let billDTO: BillDTO = {
        clientId: this.clientDTOs.find(c => c.name === clientValue)?.id || -1,
        employeeId: this.employeeDTOs.find(e => e.user.name === employeeValue)?.id || -1,
        requierdPrice: this.totalCost,
        paiedPrice: Number.parseInt(paiedPriceValue),
        exchangeRepaied: Number.parseInt(changeBackValue),
        id: 0,
        clientDebtId: 0,
        completed: false,
        time: '',
        employee: null,
        client: null,
        clientDebt: null,
        items: items
      };

      this.billService.addToBill(billDTO).subscribe(
        x => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Shipment has been added' });

          // Prepare data for printing
          const billData = {
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            employee: employeeValue,
            client: clientValue,
            items: this.Items.map(item => ({
              name: item.item.name,
              price: item.item.priceOutDTO?.price,
              quantity: item.quantity,
              notes: ''  // Add notes if any
            })),
            totalPrice: this.totalCost,
            totalQuantity: this.totalQuantity,
            discount: '',  // Add discount if any
            moneyReceived: paiedPriceValue,
            moneyToGive: changeBackValue,
            debt: ''  // Add debt if any
          };

          // Open print window
          this.openPrintWindow(billData);
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add shipment' });
        }
      );
    }
  }

  onOptionSelectedBarcode(event: any): void {
    const selectedValue = event.option.value;
    const selectedItem = this.ItemDTOs.find(item => item.name === selectedValue);
    if (selectedItem) {
      this.ProductController.setValue(selectedItem.barcode);
      this.onBarcodeScanned();
    }
  }

  onOptionSelectedClient(event: any): void {
    const selectedValue = event.option.value;
    const selectedClient = this.clientDTOs.find(client => client.name === selectedValue);
    if (selectedClient) {
      this.ClientController.setValue(selectedClient.name);
    }
  }

  onOptionSelectedEmployee(event: any): void {
    const selectedValue = event.option.value;
    const selectedEmployee = this.employeeDTOs.find(employee => employee.user.name === selectedValue);
    if (selectedEmployee) {
      this.EmployeeController.setValue(selectedEmployee.user.name);
    }
  }

  fiterDataBarcode(x: string | null): void {
    if (x == null) {
      return;
    }
    let Names: Map<number, string> = new Map<number, string>();
    this.itemNames?.forEach((val, k) => {
      if (val?.toLocaleLowerCase().includes(x?.toLocaleLowerCase())) {
        Names.set(k, val);
      }
    });
    this.itemNames = Names;
  }

  fiterDataClient(x: string | null): void {
    if (x == null || x == '') {
      this.clientNames = new Map(this.constClientNames);
      return;
    }
    let Names: Map<number, string> = new Map<number, string>();

    this.clientNames?.forEach((val, k) => {
      if (val?.toLocaleLowerCase().includes(x?.toLocaleLowerCase())) {
        Names.set(k, val);
      }
    });
    this.clientNames = Names;
  }

  fiterDataEmployee(x: string | null): void {
    if (x == null || x == '') {
      this.employeeNames = new Map(this.constEmployeeNames);
      return;
    }
    let Names: Map<number, string> = new Map<number, string>();

    this.employeeNames?.forEach((val, k) => {
      if (val?.toLocaleLowerCase().includes(x?.toLocaleLowerCase())) {
        Names.set(k, val);
      }
    });
    this.employeeNames = Names;
  }

  calculateTotals(): void {
    this.totalCost = this.Items.reduce((sum, item) => sum + (item.item.priceOutDTO?.price || 0) * item.quantity, 0);
    this.totalQuantity = this.Items.reduce((sum, item) => sum + Number(item.quantity), 0);
    this.updateChangeBack();
  }

  updateChangeBack(): void {
    const paiedPriceValue = this.myForm.get('paiedPrice')?.value;
    const shouldReturn = paiedPriceValue - this.totalCost;
    this.ChangeBackController.setValue(shouldReturn+"");
  }

  removeItem(index: number): void {
    this.Items.splice(index, 1);
    this.calculateTotals();
  }

  updateQuantity(index: number, event: any): void {
    const newQuantity = Number(event.target.value);
    if (newQuantity && newQuantity > 0) {
      this.Items[index].quantity = newQuantity;
    } else {
      this.Items[index].quantity = 1;
    }
    this.calculateTotals();
  }

  openPrintWindow(billData: any): void {
    const qrMohammad = 'https://wa.me/qr/E4HEDWTXCX22E1';
    const qrJawdat = 'https://wa.me/qr/XH7XYX45R7CUC1';

    const qrMohammadImage = `https://api.qrserver.com/v1/create-qr-code/?size=112x112&data=${encodeURIComponent(qrMohammad)}`;
    const qrJawdatImage = `https://api.qrserver.com/v1/create-qr-code/?size=112x112&data=${encodeURIComponent(qrJawdat)}`;
    const logoImage = '/assets/images/logo_bill.png'; // Use relative path

    const printContent = `
      <div style="text-align: center; font-size: 75%;">
        <h1>VAPE HUB Jericho</h1>
        <img src="${logoImage}" alt="Vape Hub Logo" style="width: 75px; height: auto; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <p>Date: ${billData.date}</p>
            <p>Time: ${billData.time}</p>
          </div>
          <div>
            <p>Employee: ${billData.employee}</p>
            <p>Client: ${billData.client}</p>
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr>
              <th style="border: 1px solid black; padding: 6px;">Item</th>
              <th style="border: 1px solid black; padding: 6px;">Price</th>
              <th style="border: 1px solid black; padding: 6px;">Qntty</th>
              <th style="border: 1px solid black; padding: 6px;">Notes</th>
            </tr>
          </thead>
          <tbody>
            ${billData.items.map((item: any) => `
              <tr>
                <td style="border: 1px solid black; padding: 6px;">${item.name}</td>
                <td style="border: 1px solid black; padding: 6px;">${item.price}</td>
                <td style="border: 1px solid black; padding: 6px;">${item.quantity}</td>
                <td style="border: 1px solid black; padding: 6px;">${item.notes}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="display: flex; justify-content: space-between; margin-top: 15px;">
          <div>
            <p>Total Price: ${billData.totalPrice}</p>
            <p>Total Quantity: ${billData.totalQuantity}</p>
            <p>Discount: ${billData.discount}</p>
          </div>
          <div>
            <p>Money Received: ${billData.moneyReceived}</p>
            <p>Money to Give: ${billData.moneyToGive}</p>
            <p>Debt: ${billData.debt}</p>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 15px;">
          <div>
            <p>Mohammad</p>
            <img style="width:45px;height:45px;" src="${qrJawdatImage}" alt="QR for Jawdat">
          </div>
          <div>
            <p>Jawdat</p>
            <img style="width:45px;height:45px;" src="${qrMohammadImage}" alt="QR for Mohammad">
          </div>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Bill</title>
            <style>
              table, th, td {
                border: 1px solid black;
                border-collapse: collapse;
              }
              th, td {
                padding: 6px;
                text-align: left;
              }
              img {
                display: block;
                margin: 0 auto;
              }
            </style>
          </head>
          <body onload="window.print()">
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
}
