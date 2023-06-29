import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MainSeviceService } from 'src/app/main-sevice.service';
import { CategoryService } from 'src/app/services/CategoryService/category.service';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';
import { MarkaService } from 'src/app/services/MarkaService/marka.service';

@Component({
  selector: 'app-item-list-filter',
  templateUrl: './item-list-filter.component.html',
  styleUrls: ['./item-list-filter.component.scss']
})
export class ItemListFilterComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({});
  
  constructor(
    public markasService: MarkaService,
    public categoryService: CategoryService,
    public itemListService: ItemListService,
    private cd: ChangeDetectorRef,
    public mainSeviceService: MainSeviceService
  ) { }

  ngOnInit(): void {
    this.categoryService.getAllICategories$().subscribe(x => {
      this.mainSeviceService.categories = x;
      this.mainSeviceService.categories.forEach(element => {
        this.mainSeviceService.categoriesDict[element.id] = false;
        this.formGroup.addControl(element.name, new FormControl<string | null>(element.name));
        this.formGroup.controls[element.name].valueChanges.subscribe(x => {
          this.mainSeviceService.categoriesDict[element.id] = !this.mainSeviceService.categoriesDict[element.id];
          this.applyFilters();
        });
      });
    });

    this.markasService.getAllIMarkas$().subscribe(x => {
      this.mainSeviceService.markas = x;
      this.mainSeviceService.markas.forEach(element => {
        this.mainSeviceService.markasDict[element.id] = false;
        this.formGroup.addControl(element.name, new FormControl<string | null>(element.name));
        this.formGroup.controls[element.name].valueChanges.subscribe(x => {
          this.mainSeviceService.markasDict[element.id] = !this.mainSeviceService.markasDict[element.id];
          this.applyFilters();
        });
      });
    });
  }

  applyFilters() {
    let selectedCategories: number[] = [];
    let selectedMarkas: number[] = [];

    // Check selected categories
    for (let [key, value] of Object.entries(this.mainSeviceService.categoriesDict)) {
      if (value === true) {
        selectedCategories.push(Number.parseInt(key));
      }
    }

    // Check selected markas
    for (let [key, value] of Object.entries(this.mainSeviceService.markasDict)) {
      if (value === true) {
        selectedMarkas.push(Number.parseInt(key));
      }
    }

    // Apply filters
    this.itemListService.getAllItemsList$().subscribe(s => {
      this.mainSeviceService.itemsList = s.filter(item =>
        (selectedCategories.length === 0 || (item.categoryDTO && selectedCategories.includes(item.categoryDTO.id))) &&
        (selectedMarkas.length === 0 || (item.markaDTO && selectedMarkas.includes(item.markaDTO.id)))
      );
    });
 
  }}