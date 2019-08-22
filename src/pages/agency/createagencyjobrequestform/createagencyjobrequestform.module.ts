import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';

import { Pipe, PipeTransform } from '@angular/core';
import { CreateAgencyJobRequestForm } from './createagencyjobrequestform';
@Pipe({ name: 'jobTaskPipe' })
export class JobTaskPipe implements PipeTransform {
  transform(elements: any[]) {
    return elements.filter(hero => !hero.ParentJobTaskId);
  }
}
@NgModule({
  declarations: [CreateAgencyJobRequestForm,JobTaskPipe],
  imports: [IonicPageModule.forChild(CreateAgencyJobRequestForm)],
    entryComponents: [CreateAgencyJobRequestForm]
})
export class CreateAgencyJobRequestFormModule { }