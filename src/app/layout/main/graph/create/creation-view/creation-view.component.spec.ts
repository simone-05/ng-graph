import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationViewComponent } from './creation-view.component';

describe('CreationViewComponent', () => {
  let component: CreationViewComponent;
  let fixture: ComponentFixture<CreationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
