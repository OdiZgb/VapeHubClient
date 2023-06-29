import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkaDTO } from 'src/app/DTOs/MarkaDTO';
import { MarkaService } from 'src/app/services/MarkaService/marka.service';

@Component({
  selector: 'app-add-marka',
  templateUrl: './add-marka.component.html',
  styleUrls: ['./add-marka.component.scss']
})
export class AddMarkaComponent implements OnInit {

  myForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private markaService: MarkaService) {
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      markaName: ['', [Validators.required, Validators.minLength(1)]],
      markaDescription: [''],
      controls: this.formBuilder.array([])
    });
  }

  addControl() {
    let controls = this.myForm?.get('controls') as FormArray;
  }
  get controls(): FormArray {
    return this.myForm.get('controls') as FormArray;
  }

  onSubmit(): void {
    if (this.myForm.valid) {

      const markaNameValue = this.myForm.get('markaName')?.value;
      const markaDescriptionValue = this.myForm.get('markaDescription')?.value;  
      console.log('this.markaNameValue',markaNameValue);
      console.log('this.markaDescriptionValue',markaDescriptionValue);

      let markaToAdd: MarkaDTO = {
        id: 0,
        name: markaNameValue,
        description: markaDescriptionValue,
        ImageURL: null
      };
      this.markaService.addMarka(markaToAdd).subscribe(
        x=>{
          console.log('done',x);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
