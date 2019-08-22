import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobrequestsPage } from './jobrequests';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [JobrequestsPage],
  imports: [IonicPageModule.forChild(JobrequestsPage),Ionic2RatingModule],
    entryComponents: [JobrequestsPage]
})
export class JobrequestsPageModule {}
