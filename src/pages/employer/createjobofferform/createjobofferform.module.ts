import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { CreateJobOfferForm } from './createjobofferform';

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'jobTaskPipe' })
export class JobTaskPipe implements PipeTransform {
  transform(elements: any[]) {
    return elements.filter(hero => !hero.ParentJobTaskId);
  }
}
@NgModule({
  declarations: [CreateJobOfferForm,JobTaskPipe],
  imports: [IonicPageModule.forChild(CreateJobOfferForm)],
    entryComponents: [CreateJobOfferForm]
})
export class CreateJobOfferFormModule { }

