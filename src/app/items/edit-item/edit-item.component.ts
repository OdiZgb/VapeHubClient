import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, lastValueFrom, of } from 'rxjs';
import { AppStore } from 'src/app/AppStore/AppStore';
import { CategoryDTO } from 'src/app/DTOs/CategoryDTO';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { ItemImageDTO } from 'src/app/DTOs/ItemImageDTO';
import { MarkaDTO } from 'src/app/DTOs/MarkaDTO';
import { PriceInDTO } from 'src/app/DTOs/PriceInDTO';
import { PriceOutDTO } from 'src/app/DTOs/PriceOutDTO';
import { CategoryService } from 'src/app/services/CategoryService/category.service';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';
import { MarkaService } from 'src/app/services/MarkaService/marka.service';
import { PriceService } from 'src/app/services/PriceService/price.service';
@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent {
    form!: FormGroup;
    isFileValid = false;
    selectedFile: File | undefined;
    categories$: Observable<CategoryDTO[]> | undefined;
    markas$: Observable<MarkaDTO[]> | undefined;
    itemId: number = 0;
    constructor(private fb: FormBuilder,  private priceService: PriceService, private categoryService: CategoryService, private markaService: MarkaService, private messageService: MessageService,private route: ActivatedRoute, private itemService: ItemListService ,private router: Router, public store$:AppStore) { }
    itemDTO: ItemDTO = {} as ItemDTO ;

    selected = new FormControl('', [Validators.required]);
    selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);
    nativeSelectFormControl = new FormControl('valid', [
      Validators.required,
      Validators.pattern('valid'),
    ]);
    categories: CategoryDTO[] = [];
    markas: MarkaDTO[] = [];
    @ViewChild('fileInput') fileInput: ElementRef | undefined;
    async ngOnInit(): Promise<void> {

      
     this.store$.select(x=>x.itemToEdit).subscribe(x=>{
      if(x!=null){
        this.itemDTO = x

      }
     });

      this.categories$ = this.categoryService.getAllICategories$();
      this.markas$ = this.markaService.getAllIMarkas$();
     
      this.categoryService.getAllICategories$().subscribe(x => {
        x.forEach(element => {
          if (element != null) {
            this.categories.push(element)
          }
        });
      })
      this.markaService.getAllIMarkas$().subscribe(x => {
        x.forEach(element => {
          if (element != null) {
            this.markas.push(element)
            console.log(this.categories);        }
        });
      })
  
      this.form = this.fb.group({
        itemName: [this.itemDTO?.name+"", [Validators.required, Validators.minLength(1)]],
        itemBarcode: [this.itemDTO.barcode, [Validators.required, Validators.minLength(1)]],
        itemCategory: [this.itemDTO.categoryDTO?.name, [Validators.required, Validators.minLength(1)]],
        itemMarka: [this.itemDTO.markaDTO?.name, [Validators.required, Validators.minLength(1)]],
        priceIn: [this.itemDTO.priceInDTO?.price],
        priceOut: [this.itemDTO.priceOutDTO?.price]
      });
  
  
    }
    onFileSelected(event: Event): void {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length) {
        this.selectedFile = target.files[0];
        this.isFileValid = true;
      } else {
        this.isFileValid = false;
      }
    }
  
    onSubmit(): void {
      if (this.form?.valid) {
        let category = this.categories.find(x => x.name == this.form.get('itemCategory')?.value)
        let marka = this.markas.find(x => x.name == this.form.get('itemMarka')?.value)
        let item = {
          id: this.itemDTO.id,
          name: this.form.get('itemName')?.value,
          barcode: this.form.get('itemBarcode')?.value,
          categoryDTO: category,
          markaDTO: marka,
          priceInDTO: this.itemDTO.priceInDTO,
          priceOutDTO: this.itemDTO.priceOutDTO
          // Removed the ItemImageDTO part because it doesn't seem to be used
        } as ItemDTO;
  
        this.itemService.editItem$(item).subscribe(x => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Item ' + x.name + ' has been added' });
          this.store$.setState(state => ({ ...state,itemToEdit: item }));
  
          if (this.form.get('priceIn')?.value != null) {
            let priceIn: PriceInDTO = {
              itemId: x.id,
              price: this.form.get('priceIn')?.value,
              item: x,
              id: 0,
              date: '',
              expirationDate: ''
            }
            this.priceService.addPriceIn(priceIn).subscribe(response => {
              item.priceInDTO = priceIn
              this.store$.setState(state => ({ ...state,itemToEdit: item }));
  
            }, error => {
            });
  
          }
          if (this.form.get('priceOut')?.value != null) {
            let priceOut: PriceOutDTO = {
              itemId: x.id,
              price: this.form.get('priceOut')?.value,
              item: x,
              id: 0,
              date: '',
              expirationDate: ''
            }
            this.priceService.addPriceOut(priceOut).subscribe(response => {
            item.priceOutDTO = priceOut
            this.store$.setState(state => ({ ...state,itemToEdit: item }));

            }, error => {
            });
  
          }
  
          const file = this.fileInput?.nativeElement.files[0];
  
          const itemImageDTO = {
            itemId: x.id,
            file: file,
            alterText: x.name
          } as ItemImageDTO;
          if (!file) {
            return;
          }
          if (this.selectedFile) {
  
            this.itemService.addImage$(itemImageDTO, this.selectedFile).subscribe(response => {
            }, error => {
            });
          };

          this.store$.setState(state => ({ ...state,itemToEdit: this.itemDTO }));
          
        });
      } else {
      }
    }
  
  }
  