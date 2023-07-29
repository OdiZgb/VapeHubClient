import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { DialogAnimationsExampleDialog } from 'src/app/Templates/dialog-animations-example-dialog/dialog-animations-example-dialog.component';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.scss']
})
export class ItemViewComponent implements OnInit {
  apiURL ='https://localhost:7260';

  itemId='';
  itemDTO: ItemDTO = {} as ItemDTO ;
  imageURL = '';
  constructor(public dialogAnimationsExampleDialog:DialogAnimationsExampleDialog,private route: ActivatedRoute, private itemService: ItemListService ,private router: Router) { }
  ngOnInit(): void {

    this.itemId = this.route.snapshot.paramMap.get('itemId') || "";
    if (this.itemId != null) {
      this.itemService.getItem$(this.itemId).subscribe(
        x => {
          if (x.name == null) {
            this.router.navigate(['/items/']);
          }
          this.itemDTO = x;
          if (x.itemsImageDTOs != null) {
            this.getImageUrl(x.itemsImageDTOs[0]?.imageURL)
          }
        },e=>{
          this.router.navigate(['/items/']);

        }
      );
    }
  }

  getImageUrl(url: string): void {
    
    this.imageURL= url?.length > 0
      ? `${this.apiURL}${url}`
      :'/assets/images/vapeItemPlaceHolder.png';
  }
  deleteItem(){
    localStorage.setItem("deleteNumber", 1+"");

    let a =this.dialogAnimationsExampleDialog.openDialog(Number.parseInt(this.itemId));
    if(this.route.snapshot.paramMap.get('itemId')=="0")
    this.itemService.getItem$(this.itemId).subscribe(
      x => {
           if(this.route.snapshot.paramMap.get('itemId')=="0"){
            this.router.navigate(['/items/']);
               }
      },e=>{
        if(this.route.snapshot.paramMap.get('itemId')=="0"){
          this.router.navigate(['/items/']);
        }
    
      }
    );
  }
}
