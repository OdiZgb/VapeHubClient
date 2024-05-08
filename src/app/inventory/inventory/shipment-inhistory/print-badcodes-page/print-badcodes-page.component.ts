import { Component } from '@angular/core';

@Component({
  selector: 'app-print-badcodes-page',
  templateUrl: './print-badcodes-page.component.html',
  styleUrls: ['./print-badcodes-page.component.scss']
})
export class PrintBadcodesPageComponent {

  barcodeToPrint = localStorage.getItem("barcodeToPrint")
}
