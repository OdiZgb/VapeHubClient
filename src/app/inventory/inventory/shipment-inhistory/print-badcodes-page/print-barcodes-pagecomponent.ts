import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-print-barcodes-page',
  templateUrl: './print-barcodes-page.component.html',
  styleUrls: ['./print-barcodes-page.component.scss']
})
export class PrintBarcodesPageComponent implements AfterViewInit {
  @ViewChild('barcodeContainer', { static: false }) barcodeContainer!: ElementRef<HTMLDivElement>;

  numRows: number = 1;
  barcodeToPrint: string;

  constructor() {
    this.barcodeToPrint = localStorage.getItem('barcodeToPrint') || 'Default-Barcode-Value';
  }

  ngAfterViewInit() {
    // Optionally initialize barcode generation for demonstration:
  }

  generateBarcode(openInNewWindow: boolean = false) {
    console.log("Entered generateBarcode, openInNewWindow:", openInNewWindow);
    let container: HTMLElement = this.barcodeContainer?.nativeElement;

    if (openInNewWindow) {
        const newWindow = window.open('', '_blank', 'toolbar=0,location=0,menubar=0,width=400,height=400');
        console.log("New window opened:", newWindow);
        if (!newWindow) {
            console.error('Failed to open new window. It may have been blocked by a popup blocker.');
            return;
        }
        newWindow.document.write(`<html><head><title>Print Barcodes</title></head><body><div id="barcodeContainer" style="width:100%;"></div></body></html>`);
        newWindow.document.close();
        container = newWindow.document.getElementById('barcodeContainer')!;
    }

    container.innerHTML = ''; // Clear previous content
    for (let i = 0; i < this.numRows; i++) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        container.appendChild(svg);
        JsBarcode(svg, this.barcodeToPrint, {
          format: 'CODE128',
          lineColor: '#000',
          width: 3, // Increase the width of the bars
          height: 100, // Increase the height of the barcode
          displayValue: true,
          margin: 10, // Add margin to prevent cutting off the barcode
          background: '#ffffff'
      });

        // Convert SVG to Canvas
        this.convertSvgToCanvas(svg, container);
    }
  }

  generateBarcodeInNewWindow() {
    this.generateBarcode(true);
  }
  convertSvgToCanvas(svg: any, container: any) {
    const xml = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const scale = 3; // Scale factor to increase the resolution. Adjust as needed.

    canvas.width = svg.clientWidth * scale;
    canvas.height = svg.clientHeight * scale;
    canvas.style.width = svg.clientWidth + 'px'; // Reset the display size to the original dimensions
    canvas.style.height = svg.clientHeight + 'px';

    const ctx = canvas.getContext('2d');
    ctx!.scale(scale, scale); // Scale the context to the new canvas size

    const img = new Image();
    img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        container.replaceChild(canvas, svg); // Replace the SVG with Canvas
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(xml);
}

}
