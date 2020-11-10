import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhasanxuatComponent } from './nhasanxuat.component';

describe('NhasanxuatComponent', () => {
  let component: NhasanxuatComponent;
  let fixture: ComponentFixture<NhasanxuatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhasanxuatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhasanxuatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
