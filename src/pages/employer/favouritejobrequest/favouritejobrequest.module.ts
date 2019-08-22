import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { EmployerFavouriteJobRequest } from './favouritejobrequest';

@NgModule({
  declarations: [EmployerFavouriteJobRequest],
  imports: [IonicPageModule.forChild(EmployerFavouriteJobRequest),Ionic2RatingModule],
    entryComponents: [EmployerFavouriteJobRequest]
})
export class EmployerFavouriteJobRequestModule {}
