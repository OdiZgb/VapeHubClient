import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CategoryDTO } from 'src/app/DTOs/CategoryDTO';
import { ItemDTO } from 'src/app/DTOs/ItemDTO';
import { ItemImageDTO } from 'src/app/DTOs/ItemImageDTO';
import { MarkaDTO } from 'src/app/DTOs/MarkaDTO';
import { CategoryService } from 'src/app/services/CategoryService/category.service';
import { ItemListService } from 'src/app/services/ItemsService/item-list.service';
import { MarkaService } from 'src/app/services/MarkaService/marka.service';
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  form!: FormGroup;
  isFileValid = false;
  selectedFile: File | undefined ;
  constructor(private fb: FormBuilder,private itemService:ItemListService, private categoryService:CategoryService, private markaService:MarkaService) { }
  selected = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);
  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid'),
  ]);
  categories:CategoryDTO[] = [];
  markas:MarkaDTO[] = [];
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  ngOnInit(): void {
    this.categoryService.getAllICategories$().subscribe(x=>{
      x.forEach(element => {
        if(element!=null){
          this.categories.push(element)
        }
      });
    })
    this.markaService.getAllIMarkas$().subscribe(x=>{
      x.forEach(element => {
        if(element!=null){
          this.markas.push(element)
        }
      });
    })

    this.form = this.fb.group({
      itemName: ['', [Validators.required, Validators.minLength(1)]],
      itemBarcode: ['', [Validators.required, Validators.minLength(1)]],
      itemCategory: ['', [Validators.required, Validators.minLength(1)]],
      itemMarka: ['', [Validators.required, Validators.minLength(1)]]
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
      let category =this.categories.find(x=>x.name== this.form.get('itemCategory')?.value)
      let marka =this.markas.find(x=>x.name== this.form.get('itemMarka')?.value)
      let item  ={
        id: 0,
        name: this.form.get('itemName')?.value,
        barcode: this.form.get('itemBarcode')?.value,
        categoryDTO : {
          id :category?.id
        },
        markaDTO : {
          id :marka?.id
        }
        // Removed the ItemImageDTO part because it doesn't seem to be used
      } as ItemDTO;
      
      this.itemService.addItem$(item).subscribe(x=>{
        console.log("added product",x);
        const file = this.fileInput?.nativeElement.files[0];

        const itemImageDTO = {
          itemId: x.id,
          file: file,
          alterText : x.name
        } as ItemImageDTO;
if (!file) {
  console.log('No file selected');
  return;
}
if(this.selectedFile){
  console.log("Image itemImageDTOitemImageDTO", itemImageDTO);

    this.itemService.addImage$(itemImageDTO, this.selectedFile).subscribe(response => {
      console.log("Image itemImageDTOitemImageDTO", itemImageDTO);
    }, error => {
      console.log("Image upload failed", error);
    });};
      });
      console.log("this.form",this.form)
    } else {
      console.log('Form is invalid or file is not selected');
    }
  }

}
