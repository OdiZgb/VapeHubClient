import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { MainSeviceService } from 'src/app/main-sevice.service';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';
@Component({
  selector: 'app-dialog-animations-example-dialog',
  templateUrl: './dialog-animations-example-dialog.component.html',
  styleUrls: ['./dialog-animations-example-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})

export class DialogAnimationsExampleDialog {
  itemId =0;
  private itemIdSource = new BehaviorSubject<number>(0);
  currentItemId = this.itemIdSource.asObservable();
  openDialog(itemId:number): void {
    localStorage.setItem("ItemIsDeleting","true");
    localStorage.setItem("ItemIsDeletingId",""+itemId);
    this.itemId = itemId;
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px',
        enterAnimationDuration:"0ms",
        exitAnimationDuration:"0ms"
    });
    this.itemId = itemId;

  }
  constructor(public mainSeviceService:MainSeviceService,public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>,public dialog: MatDialog,  public itemService:ItemListService) {}


  
  delete(){
    if(localStorage.getItem("ItemIsDeleting")=="true"){

    let a :ItemDTO[]=[];
    
      let itemId = Number.parseInt(localStorage.getItem("ItemIsDeletingId") || '');
      this.mainSeviceService.itemsList.forEach(element => {
         if(element.id != itemId){
          a.push(element);
          //alert(element.name);
         } 
        }
        
    );
    this.mainSeviceService.itemsList = a;
    
    this.itemService.deleteItem$(itemId).subscribe(x=>{
      
    });
      localStorage.setItem("ItemIsDeleting","false");
    }

  }
}