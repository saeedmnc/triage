import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeriazhListComponent } from './teriazh-list.component';

describe('TeriazhListComponent', () => {
  let component: TeriazhListComponent;
  let fixture: ComponentFixture<TeriazhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeriazhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeriazhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
