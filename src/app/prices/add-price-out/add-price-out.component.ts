import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable, map, startWith } from 'rxjs';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { PriceOutDTO } from 'src/app/DTOs/PriceOutDTO';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';
import { PriceService } from 'src/app/services/PriceService/price.service';

@Component({
  selector: 'app-add-price-out',
  templateUrl: './add-price-out.component.html',
  styleUrls: ['./add-price-out.component.scss']
})
export class AddPriceOutComponent implements OnInit {
  myForm!: FormGroup;
  ProductController = new FormControl('');
  itemNames: Map<number, string> = new Map<number, string>();
  constNames: Map<number, string> = new Map<number, string>();
  ItemDTOs:ItemDTO[]=[];
  filteredOptions!: Observable<string[]>;
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  foundProduct: boolean = false;
  foundItemId: number= -1;

  constructor(private formBuilder: FormBuilder, private priceService: PriceService, private itemService: ItemListService, private messageService: MessageService) {}
   a:string[]=[];

  ngOnInit(): void {
    this.itemService.getAllItemsList$().subscribe(
      x => {
        this.ItemDTOs=x;
        x.forEach(element => {
          this.itemNames.set(element.id, element.name);
          this.constNames.set(element.id, element.name);
        });
      }
    );
 
    this.myForm = this.formBuilder.group({
      barcodeName: [''],
      priceOut: ['', [Validators.required, Validators.minLength(1)]],
    });
    this.ProductController.valueChanges.subscribe(
      x=>{
        let foundItemByBarcode = this.ItemDTOs.find(s=>s.barcode==x)
        if(foundItemByBarcode!=null){
          this.foundProduct=true;
          this.foundItemId=foundItemByBarcode.id;
          this.ProductController.setValue(foundItemByBarcode.name);
        }
        this.fiterData(x);
        console.log(x,"ssschange");
      if(x==null||x?.length==0){
        this.itemNames=this.constNames
      }
      }
    );
  }
  fiterData(x: string | null): void {
    if(x==null){
      return;
    }
  let Names: Map<number, string> = new Map<number, string>();

    this.itemNames?.forEach((val,k) => {
      if(val?.toLocaleLowerCase().includes(x?.toLocaleLowerCase())){
        Names.set(k,val);
      }
    });
    this.itemNames=Names;
    console.log(x,"this is the same");
  }

  onSubmit(): void {
    if (this.myForm?.valid) {
      const barcodeValue = this.myForm.get('barcodeName')?.value;
      const priceOutValue = this.myForm.get('priceOut')?.value;

      console.log('barcodeValue', barcodeValue);
      console.log('priceOutValue', priceOutValue);

      let priceOutToAdd: PriceOutDTO = {
        id: 0,
        itemId: this.foundItemId,
        price: priceOutValue,
        item: {
          id: this.foundItemId,
        } as ItemDTO,
        date: '',
        expirationDate: ''
      };

 
      this.priceService.addPriceOut(priceOutToAdd).subscribe(
        x => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Price '+x.price+' has been added'});

        },
        error => {
          console.log('Error adding PriceOut', error);
        }
      );

    } else {
      console.log('Form is invalid');
    }
  }
  onOptionSelected(event: any): void {
    const selectedValue = event.option.value;
    const selectedKey = this.getKeyFromValue(selectedValue);
    console.log('Selected Key:', selectedKey);
    this.foundProduct=true;
    this.foundItemId=selectedKey || -1;
    // Assign the selected key to a variable or perform any other logic
  }
  getKeyFromValue(value: string): number | undefined {
    const entry = Array.from(this.itemNames.entries()).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined;
  }
}
