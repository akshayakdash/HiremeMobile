import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { JobOfferDetails } from './jobofferdetails';

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'jobTaskPipe' })
export class JobTaskPipe implements PipeTransform {
  transform(elements: any[]) {
    return elements.filter(hero => !hero.ParentJobTaskId);
  }
}

@NgModule({
  declarations: [JobOfferDetails,JobTaskPipe],
  imports: [IonicPageModule.forChild(JobOfferDetails),Ionic2RatingModule],
    entryComponents: [JobOfferDetails]
})
export class JobOfferDetailsModule { }