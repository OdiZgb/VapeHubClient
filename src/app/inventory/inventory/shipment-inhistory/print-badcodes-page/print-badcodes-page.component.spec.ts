import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBadcodesPageComponent } from './print-badcodes-page.component';

describe('PrintBadcodesPageComponent', () => {
  let component: PrintBadcodesPageComponent;
  let fixture: ComponentFixture<PrintBadcodesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBadcodesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintBadcodesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
