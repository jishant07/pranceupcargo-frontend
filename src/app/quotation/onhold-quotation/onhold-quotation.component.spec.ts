import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnholdQuotationComponent } from './onhold-quotation.component';

describe('OnholdQuotationComponent', () => {
  let component: OnholdQuotationComponent;
  let fixture: ComponentFixture<OnholdQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnholdQuotationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnholdQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
