import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularImageViewerComponent } from './angular-image-viewer.component';

describe('AngularImageViewerComponent', () => {
  let component: AngularImageViewerComponent;
  let fixture: ComponentFixture<AngularImageViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularImageViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularImageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
