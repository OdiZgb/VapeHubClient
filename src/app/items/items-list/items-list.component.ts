import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { AppComponent } from 'src/app/app.component';
import { MainSeviceService } from 'src/app/main-sevice.service';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';
import { ItemListFilterComponent } from './item-list-filter/item-list-filter.component';
import { CategoryService } from 'src/app/services/CategoryService/category.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent implements OnInit {
  apiURL ='https://localhost:7260';
  constructor(public mainSeviceService:MainSeviceService ,private cd: ChangeDetectorRef,public categoryService:CategoryService, private itemListService:ItemListService) { }
  
  ngOnInit(): void {
    let filterActive =false;
    for (let value of Object.values(this.mainSeviceService.categoriesDict)) {
      if(value == true){
        filterActive = true;
      }
    }
    if(filterActive==false){
    this.itemListService.getAllItemsList$().subscribe(
      x=>{
        this.mainSeviceService.itemsList=x;
      }
    )
  }
    this.categoryService.getAllICategories$().subscribe(
      x=>{
        this.cd.detectChanges();

        this.mainSeviceService.categories=x;
        this.cd.detectChanges();

      }
    )
  }
  getImageUrl(item: ItemDTO): string {
    
    return item.itemsImageDTOs && item.itemsImageDTOs.length > 0 && item.itemsImageDTOs[0].imageURL
      ? `${this.apiURL}${item.itemsImageDTOs[0].imageURL}`
      :'assets/images/vapeItemPlaceHolder.png';
  }
}
