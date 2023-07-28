import { Component, OnInit } from '@angular/core';
import {    FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { EmployeeDTO } from 'src/app/DTOs/EmployeeDTO';
import { EmployeeService } from 'src/app/services/EmployeeService/employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit{
  myForm!: FormGroup;

  constructor(private employeeService:EmployeeService,private formBuilder: FormBuilder, private messageService: MessageService){}
  ngOnInit(): void {
    this.createForm();
  }

  public addEmployee(employeeDTO:EmployeeDTO):Observable<EmployeeDTO>{
    return this.employeeService.addEmployee(employeeDTO)
  }
 
  onSubmit(): void {
    if (this.myForm.valid) {
      const employeeNameValue = this.myForm.get('employeeName')?.value;
      const employeeNumberValue = this.myForm.get('employeeNumber')?.value;
      const employeeEmailValue = this.myForm.get('employeeEmail')?.value;
 
      let employeeToAdd: EmployeeDTO = {
        id: 0,
        name: employeeNameValue,
        mobileNumber: employeeNumberValue,
        email: employeeEmailValue
      } as EmployeeDTO;

      this.employeeService.addEmployee(employeeToAdd).subscribe(
        x=>{
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee  '+x.name+' has been added'});

        }
      );
    } else {
    }
  }
 createForm(){
  this.myForm = this.formBuilder.group({
    employeeName: ['', [Validators.required, Validators.minLength(1)]],
    employeeNumber: ['', [Validators.required, Validators.minLength(1)]],
    employeeEmail: ['', []]  
  });
 }
}
