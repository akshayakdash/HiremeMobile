import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobRequestNotePage } from './jobrequestnote';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    JobRequestNotePage,
  ],
  imports: [
    IonicPageModule.forChild(JobRequestNotePage),Ionic2RatingModule
  ],
})
export class JobRequestNotePageModule {}
