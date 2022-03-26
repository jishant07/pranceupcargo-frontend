import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingOrdersComponent } from './ongoing-orders.component';

describe('OngoingOrdersComponent', () => {
  let component: OngoingOrdersComponent;
  let fixture: ComponentFixture<OngoingOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngoingOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
