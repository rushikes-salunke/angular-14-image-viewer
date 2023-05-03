import { NgModule } from '@angular/core';
import { AngularImageViewerComponent } from './angular-image-viewer.component';
import { FullScreenDirective } from './directive/full-screen.directive';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    AngularImageViewerComponent,
    FullScreenDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AngularImageViewerComponent
  ]
})
export class AngularImageViewerModule { }
