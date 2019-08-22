import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublishedJob } from './publishedjob';
import { Ionic2RatingModule } from 'ionic2-rating';



@NgModule({
  declarations: [PublishedJob],
  imports: [IonicPageModule.forChild(PublishedJob),Ionic2RatingModule],
    entryComponents: [PublishedJob]
})
export class PublishedJobModule { }