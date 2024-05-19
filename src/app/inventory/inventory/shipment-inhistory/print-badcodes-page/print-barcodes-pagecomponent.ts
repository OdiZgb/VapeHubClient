import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as JsBarcode from 'jsbarcode';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-print-barcodes-page',
  templateUrl: './print-barcodes-page.component.html',
  styleUrls: ['./print-barcodes-page.component.scss']
})
export class PrintBarcodesPageComponent implements AfterViewInit {
  @ViewChild('barcodeContainer', { static: false }) barcodeContainer!: ElementRef<HTMLDivElement>;

  numRows: number = 1;  // Adjusted to ensure single barcode by default
  barcodeToPrint: string;
  dpi: number;
  widthInches: number;
  heightInches: number;
  printLayout: string;

  private settingsChange = new Subject<void>();

  constructor() {
    this.barcodeToPrint = localStorage.getItem('barcodeToPrint') || 'Default-Barcode-Value';
    this.dpi = Number(localStorage.getItem('dpi')) || 203;
    this.widthInches = Number(localStorage.getItem('widthInches')) || 3.36;
    this.heightInches = Number(localStorage.getItem('heightInches')) || 1.9685;
    this.printLayout = localStorage.getItem('printLayout') || 'single';

    this.settingsChange.pipe(debounceTime(300)).subscribe(() => {
      this.saveSettings();
      this.generateBarcode();
    });
  }

  ngAfterViewInit() {
    this.generateBarcode(); // Initial generation of the barcode
  }

  onSettingsChange() {
    this.settingsChange.next();
  }

  saveSettings() {
    localStorage.setItem('dpi', String(this.dpi));
    localStorage.setItem('widthInches', String(this.widthInches));
    localStorage.setItem('heightInches', String(this.heightInches));
    localStorage.setItem('printLayout', this.printLayout);
  }

  async generateBarcode() {
    const container: HTMLElement = this.barcodeContainer?.nativeElement;
    container.innerHTML = ''; // Clear previous content

    // Determine number of columns and rows based on the selected layout
    const numColumns = this.printLayout === 'double' ? 2 : 1;
    const numRows = 1; // Always one row for simplicity

    for (let i = 0; i < numRows; i++) {
      const row = document.createElement('div');
      row.className = 'barcode-row';
      container.appendChild(row);

      for (let j = 0; j < numColumns; j++) {
        const index = i * numColumns + j;
        if (index >= numColumns) break; // Adjust the break condition

        const wrapper = document.createElement('div');
        wrapper.className = 'barcode-wrapper';
        if (this.printLayout === 'double') {
          wrapper.classList.add('double-column');
        }

        const titleDiv = document.createElement('div');
        titleDiv.className = 'barcode-title';
        titleDiv.textContent = 'VapeHub © Jericho';
        wrapper.appendChild(titleDiv);

        const img = document.createElement('img');
        img.className = 'barcode-image';
        await this.renderBarcode(img);
        wrapper.appendChild(img);
        row.appendChild(wrapper);
      }
    }
  }

  async renderBarcode(img: HTMLImageElement) {
    return new Promise<void>((resolve) => {
      const canvas = document.createElement('canvas');

      // Set canvas dimensions to the desired size for the barcode
      const width = this.widthInches * this.dpi; // inches * DPI
      const height = this.heightInches * this.dpi; // inches * DPI
      canvas.width = width;
      canvas.height = height;

      JsBarcode(canvas, this.barcodeToPrint, {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,  // Width of a single bar
        height: height - 40,  // Adjust height to fit well, leave space for text
        displayValue: true,
        fontOptions: 'bold',
        font: 'Arial',
        textMargin: 10,
        margin: 0,
        background: '#ffffff',
        flat: true,
        textAlign: 'center',
        fontSize: 20  // Adjust font size for clarity
      });

      img.src = canvas.toDataURL('image/png');
      img.style.width = `${this.widthInches}in`; // Set image width in inches
      img.style.height = `${this.heightInches}in`; // Set image height in inches
      resolve();
    });
  }

  async printBarcode() {
    // Generate barcode to ensure the latest settings are applied
    await this.generateBarcode();

    // Open a new window for printing
    let newWindow: Window | null = window.open('', '_blank', 'toolbar=0,location=0,menubar=0,width=800,height=600');
    if (!newWindow) {
      console.error('Failed to open new window. It may have been blocked by a popup blocker.');
      return;
    }

    const css = `<style>
      body, html {
        margin: 0;
        padding: 0;
        background: #fff; /* Set a white background for the whole page */
        width: 100%;
        height: 100%;
      }
      svg {
        background: #fff !important; /* Explicitly set white background for SVG */
        color: #000 !important; /* Ensure the barcode itself is black */
      }
      .input-container, .generateBarcode {
        display: none; /* Hide non-relevant elements */
      }
      .barcode-wrapper {
        page-break-inside: avoid; /* Ensure the wrapper is not split across pages */
        break-inside: avoid;
        width: ${this.widthInches}in;
        height: ${this.heightInches + 0.5}in; /* Include space for the title */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .double-column {
        width: 50%;
        box-sizing: border-box;
        padding: 0 10px;
      }
      #barcodeContainer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      #barcodeContainer img {
        max-width: 100%;
        height: auto;
      }
    </style>`;

    newWindow.document.write(`<html><head><title>Print Barcodes</title>${css}</head><body><div id="barcodeContainer"></div></body></html>`);
    newWindow.document.close();

    const container = newWindow.document.getElementById('barcodeContainer');
    if (container) {
      const numColumns = this.printLayout === 'double' ? 2 : 1;
      const numRows = 1; // Always one row for simplicity

      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
          const index = i * numColumns + j;
          if (index >= numColumns) break; // Adjust the break condition

          const wrapper = document.createElement('div');
          wrapper.className = 'barcode-wrapper';
          if (this.printLayout === 'double') {
            wrapper.classList.add('double-column');
          }

          const titleDiv = document.createElement('div');
          titleDiv.className = 'barcode-title';
          titleDiv.textContent = 'VapeHub © Jericho';
          wrapper.appendChild(titleDiv);

          const img = document.createElement('img');
          img.className = 'barcode-image';
          await this.renderBarcode(img);
          wrapper.appendChild(img);
          container.appendChild(wrapper);
        }
      }

      setTimeout(() => {
        newWindow!.print();
        newWindow!.close();
      }, 1000); // Allow time for barcodes to render before printing
    }
  }
}
