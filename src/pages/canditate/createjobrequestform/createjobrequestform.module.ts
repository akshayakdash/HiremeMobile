import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { CreateJobRequestForm } from './createjobrequestform';

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'jobTaskPipe' })
export class JobTaskPipe implements PipeTransform {
  transform(elements: any[]) {
    return elements.filter(hero => !hero.ParentJobTaskId);
  }
}
@NgModule({
  declarations: [CreateJobRequestForm,JobTaskPipe],
  imports: [IonicPageModule.forChild(CreateJobRequestForm)],
    entryComponents: [CreateJobRequestForm]
})
export class CreateJobRequestFormModule { }