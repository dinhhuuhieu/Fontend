import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitiethopdongComponent } from './chitiethopdong.component';

describe('ChitiethopdongComponent', () => {
  let component: ChitiethopdongComponent;
  let fixture: ComponentFixture<ChitiethopdongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChitiethopdongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChitiethopdongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
