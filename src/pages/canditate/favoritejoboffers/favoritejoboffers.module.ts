import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoritejoboffersPage } from './favoritejoboffers';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    FavoritejoboffersPage,
  ],
  imports: [
    IonicPageModule.forChild(FavoritejoboffersPage),Ionic2RatingModule
  ],
})
export class FavoritejoboffersPageModule {}
