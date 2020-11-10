import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HopdongComponent } from './hopdong.component';

describe('HopdongComponent', () => {
  let component: HopdongComponent;
  let fixture: ComponentFixture<HopdongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HopdongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HopdongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
