import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemsComponent } from './items/items.component';
import { ItemsListComponent } from './items/items-list/items-list.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { ItemCardComponent } from './Templates/item-card/item-card.component';
import { AddItemComponent } from './items/add-item/add-item.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidePanelComponent } from './side-panel/side-panel.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { CategoriesComponent } from './categories/categories.component';
import { AddCategoryComponent } from './categories/add-category/add-category.component';
import {MatSelectModule} from '@angular/material/select';
import { MiddlePanelComponent } from './home/middle-panel/middle-panel.component';
import { HomeComponent } from './home/home.component';
import { MarkasComponent } from './markas/markas.component';
import { AddMarkaComponent } from './markas/add-marka/add-marka.component';
import { PricesComponent } from './prices/prices.component';
import {MatButtonModule} from '@angular/material/button'; 
import {MatIconModule} from '@angular/material/icon'; 
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { DialogAnimationsExampleDialog } from './Templates/dialog-animations-example-dialog/dialog-animations-example-dialog.component'; 
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ItemListFilterComponent } from './items/items-list/item-list-filter/item-list-filter.component'; 
import { CheckboxModule } from 'primeng/checkbox';
import { CategoryCardComponent } from './Templates/category-card/category-card.component';
import { MarkaCardComponent } from './Templates/marka-card/marka-card.component';
import { DeleteCategoryDialogComponent } from './Templates/delete-category-dialog/delete-category-dialog.component';
import { AddPriceInComponent } from './prices/add-price-in/add-price-in.component';
import { AddPriceOutComponent } from './prices/add-price-out/add-price-out.component';
import { InventoryComponent } from './inventory/inventory/inventory.component';
import { TableModule } from 'primeng/table';
import { ShipmentInhistoryComponent } from './inventory/inventory/shipment-inhistory/shipment-inhistory.component';
import { AddShipmentComponent } from './inventory/inventory/add-shipment/add-shipment.component';
import { DisplayCurrentQuantitesComponent } from './inventory/inventory/display-current-quantites/display-current-quantites.component';
import { TradersComponent } from './Traders/traders/traders.component';
import { AddTraderComponent } from './Traders/add-trader/add-trader.component';
import { ComponentStore } from '@ngrx/component-store';
import { AppStore } from './AppStore/AppStore';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    ItemsListComponent,
    ItemCardComponent,
    AddItemComponent,
    SidePanelComponent,
    CategoriesComponent,
    AddCategoryComponent,
    MiddlePanelComponent,
    HomeComponent,
    MarkasComponent,
    AddMarkaComponent,
    PricesComponent,
    ItemListFilterComponent,
    CategoryCardComponent,
    MarkaCardComponent,
    AddPriceInComponent,
    AddPriceOutComponent,
    InventoryComponent,
    ShipmentInhistoryComponent,
    AddShipmentComponent,
    DisplayCurrentQuantitesComponent,
    TradersComponent,
    AddTraderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTabsModule,
    MatSelectModule,
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    TableModule,
    MatCheckboxModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    CheckboxModule,
    AutoCompleteModule
  ],
  providers: [
    DialogAnimationsExampleDialog ,DeleteCategoryDialogComponent,  {
      provide: MatDialogRef,
      useValue: {}
    },
    AppStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
