import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphViewEditComponent } from './graph-view-edit.component';

describe('GraphViewEditComponent', () => {
  let component: GraphViewEditComponent;
  let fixture: ComponentFixture<GraphViewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphViewEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
