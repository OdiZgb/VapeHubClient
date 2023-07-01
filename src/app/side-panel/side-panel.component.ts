import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {
  panelOpenState = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  navigateToItemsRoute(): void {
    this.router.navigate(['/items/list']);
  }
  navigateToAddItemRoute(): void {
    this.router.navigate(['items/add']);
  }
  navigateToAddMarkaRoute(): void {
    this.router.navigate(['markas/add']);
  }
  navigateToAddPriceRoute(): void {
    this.router.navigate(['price/add']);
  }
  navigateToDisplayProducsRoute(): void {
    this.router.navigate(['items/list']);
  }
  navigateToAddCategoryRoute(): void {
    this.router.navigate(['category/add']);
  }
  navigateToDisplayCategoriesRoute(): void {
    this.router.navigate(['category/display']);
  }
  navigateToDisplayMarkasRoute(): void {
    this.router.navigate(['marka/display']);
  }
  navigateToAddPriceInRoute(): void {
    this.router.navigate(['pricein/add']);
  }
  navigateToAddPriceOutRoute(): void {
    this.router.navigate(['priceout/add']);
  }

  navigateToAddInventoryRoute(): void {
    this.router.navigate(['inventory/add']);
  }
  navigateToDisplayInventoryRoute(): void {
    this.router.navigate(['inventory/display']);
  }
  navigateToDisplayInventoryHistoryRoute(): void {
    this.router.navigate(['inventory/history']);
  }
  navigateToDisplayTradersRoute(): void {
    this.router.navigate(['inventory/traders']);
  }
  navigateToAddTraderRoute(): void {
    this.router.navigate(['inventory/traders/add']);
  }
  
}
