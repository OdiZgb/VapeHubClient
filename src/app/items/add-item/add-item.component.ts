import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
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
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  form!: FormGroup;
  isFileValid = false;
  selectedFile: File | undefined;
  categories$: Observable<CategoryDTO[]> | undefined;
  markas$: Observable<MarkaDTO[]> | undefined;
  constructor(private fb: FormBuilder, private itemService: ItemListService, private priceService: PriceService, private categoryService: CategoryService, private markaService: MarkaService, private messageService: MessageService) { }
  selected = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);
  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid'),
  ]);
  categories: CategoryDTO[] = [];
  markas: MarkaDTO[] = [];
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  ngOnInit(): void {
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
      itemName: ['', [Validators.required, Validators.minLength(1)]],
      itemBarcode: ['', [Validators.required, Validators.minLength(1)]],
      itemCategory: ['', [Validators.required, Validators.minLength(1)]],
      itemMarka: ['', [Validators.required, Validators.minLength(1)]],
      priceIn: [''],
      priceOut: ['']
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
        id: 0,
        name: this.form.get('itemName')?.value,
        barcode: this.form.get('itemBarcode')?.value,
        categoryDTO: {
          id: category?.id
        },
        markaDTO: {
          id: marka?.id
        }
        // Removed the ItemImageDTO part because it doesn't seem to be used
      } as ItemDTO;

      this.itemService.addItem$(item).subscribe(x => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Item ' + x.name + ' has been added' });

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
      });
    } else {
    }
  }

}
