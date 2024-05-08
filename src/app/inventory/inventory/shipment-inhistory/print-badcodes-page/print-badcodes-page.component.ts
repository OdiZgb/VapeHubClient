import { Component, ViewChild, ElementRef } from '@angular/core';
import html2canvas from 'html2canvas';
import jspdf, { jsPDF } from 'jspdf';
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

  generateBarcode() {
    this.rows = [];
    for (let i = 0; i < this.numRows; i++) {
      this.rows.push(i);
    }
  }

  printBarcode() {
    // Create a new jsPDF instance
    let pdf = new jsPDF('p', 'mm', 'a4'); 
    // Get the barcode container element
    const element = this.barcodeContainer.nativeElement;

    // Use html2canvas to capture the element as an image
    html2canvas(element).then((canvas) => {
      // Convert the canvas image to a data URL
      const imageData = canvas.toDataURL('image/png');

      // Add the image to the PDF document
      const imgWidth = 260; // Width of A4 page in mm
      const imgHeight = canvas.height * imgWidth / canvas.width; // Calculate height based on aspect ratio
      pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF file
      pdf.save('barcode.pdf');
    });
  }
  
}
