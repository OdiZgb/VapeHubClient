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

  async generateBarcode(openInNewWindow: boolean = false) {
    let container: HTMLElement = this.barcodeContainer?.nativeElement;
    let newWindow: Window | null = null;

    if (openInNewWindow) {
      newWindow = window.open('', '_blank', 'toolbar=0,location=0,menubar=0,width=400,height=600');
      if (!newWindow) {
        console.error('Failed to open new window. It may have been blocked by a popup blocker.');
        return;
      }

      const css = `<style>
        body, html { margin: 0; padding: 0; background: #fff; width: 100%; height: 100%; overflow-y: auto; }
        #barcodeContainer { width: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column; }
        .barcode-wrapper { margin-top: 0.1in; text-align: center; page-break-inside: avoid; margin-bottom: 0.5in; }
        .barcode-text { font-size: 20px; font-family: Arial, sans-serif; font-weight: bold; margin-bottom: 5px; }
        svg { max-width: 100%; height: auto; }
        @media print {
          body, html { width: 400px; height: auto; }
          #barcodeContainer { width: 100%; height: auto; }
          .input-container, .generateBarcode { display: none; }
          .barcode-wrapper { page-break-inside: avoid; margin-bottom: 0.5in; }
          svg { width: 100%; height: auto; }
        }
      </style>`;

      newWindow.document.write(`<html><head><title>Print Barcodes</title>${css}</head><body><div id="barcodeContainer"></div></body></html>`);
      newWindow.document.close();
      container = newWindow.document.getElementById('barcodeContainer')!;
    }

    container.innerHTML = ''; // Clear previous content

    for (let i = 0; i < this.numRows; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'barcode-wrapper';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'barcode-text';
      titleDiv.textContent = 'VapeHub © Jericho';
      wrapper.appendChild(titleDiv);

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.style.width = '100%';
      svg.style.height = 'auto';
      wrapper.appendChild(svg);
      container.appendChild(wrapper);

      await this.renderBarcode(svg);

      this.convertSvgToCanvas(svg, wrapper);
    }

    if (newWindow) {
      setTimeout(() => {
        newWindow!.print();
        newWindow!.close();
      }, 2000); // Allow time for barcodes to render before printing
    }
  }

  async renderBarcode(svg: SVGElement) {
    return new Promise<void>((resolve) => {
      JsBarcode(svg, this.barcodeToPrint, {
        format: 'CODE128',
        lineColor: '#000',
        width: 1.5,
        height: 60,
        displayValue: true,
        fontOptions: 'bold',
        font: 'Arial',
        textMargin: 2,
        margin: 5,
        background: '#ffffff',
        flat: true,
        textAlign: 'center'
      });
      resolve();
    });
  }

  convertSvgToCanvas(svg: SVGElement, container: HTMLElement) {
    const xml = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');

    const dpi = 203;
    const widthInches = 4;
    const heightInches = 2;

    const widthPixels = widthInches * dpi;
    const heightPixels = heightInches * dpi;

    canvas.width = widthPixels;
    canvas.height = heightPixels;
    canvas.style.width = `${widthInches}in`;
    canvas.style.height = `${heightInches}in`;

    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, widthPixels, heightPixels);
      container.replaceChild(canvas, svg);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(xml);
  }

  generateBarcodeInNewWindow() {
    this.generateBarcode(true);
  }
}
