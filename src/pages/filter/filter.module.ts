import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterPage, JobTaskPipe1 } from './filter';

@NgModule({
  declarations: [
    FilterPage,
    JobTaskPipe1
  ],
  imports: [
    IonicPageModule.forChild(FilterPage),
  ],
})
export class FilterPageModule {}
