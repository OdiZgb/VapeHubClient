import { Component, Input } from '@angular/core';
import { DialogAnimationsExampleDialog } from '../dialog-animations-example-dialog/dialog-animations-example-dialog.component';

@Component({
  selector: 'app-marka-card',
  templateUrl: './marka-card.component.html',
  styleUrls: ['./marka-card.component.scss']
})
export class MarkaCardComponent {
  @Input() name:string='';
  @Input() barcode:string='';
  @Input() category:string='';
  @Input() marka:string='';
  @Input() description:string='';
  @Input() price:string='';
  @Input() src:string ='/src/vapeItemPlaceHolder.png' ;
  @Input() itemId:number=0;
  constructor(public dialogAnimationsExampleDialog:DialogAnimationsExampleDialog) {}

  deleteItem(){
      
    this.dialogAnimationsExampleDialog.openDialog(this.itemId);
  }
}
