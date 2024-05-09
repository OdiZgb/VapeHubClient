import { Component, ViewChild, ElementRef } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-print-badcodes-page',
  templateUrl: './print-badcodes-page.component.html',
  styleUrls: ['./print-badcodes-page.component.scss']
})
export class PrintBadcodesPageComponent {
  @ViewChild('barcodeContainer') barcodeContainer!: ElementRef;

  numRows: number = 1;
  barcodeToPrint = localStorage.getItem("barcodeToPrint");
  rows: number[] = [];

  constructor() {}

  generateBarcode() {
    this.rows = Array.from({ length: this.numRows }, (_, i) => i);
  }

  printBarcode() {
    const pdf = new jspdf('p', 'mm', 'a4');

    // Get the barcode container element
    const element = this.barcodeContainer.nativeElement;

    // Loop through each barcode element and generate barcode image
    element.querySelectorAll('.barcode').forEach((barcodeElement: HTMLElement, index: number) => {
      // Get the value of the barcode
      const barcodeValue = localStorage.getItem("barcodeToPrint")+"";

      // Generate the barcode image
      JsBarcode(barcodeElement, barcodeValue, {
        format: 'CODE128', // Specify barcode format if needed
        displayValue: false // Disable displaying the value next to the barcode
      });

      // Add the number under the barcode
      const barcodeNumber = document.createElement('div');
      barcodeNumber.textContent = (index + 1).toString();
      barcodeNumber.className = 'barcode-number';
      barcodeElement?.parentNode?.appendChild(barcodeNumber);
    });

    // Use html2canvas to capture the element as an image
    html2canvas(element, { scale: 2, logging: false } as any).then((canvas) => {
      // Convert the canvas image to a data URL with higher quality
      const imageData = canvas.toDataURL('image/jpeg', 1.0);

      // Calculate the PDF image dimensions
      const imgWidth = 190; // Adjust dimensions as needed
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the PDF document
      pdf.addImage(imageData, 'JPEG', 10, 10, imgWidth, imgHeight);

      // Save the PDF file
      pdf.save('barcode.pdf');
    });
  }
}
