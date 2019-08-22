import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EployerJobOffer } from './myjoboffer';

@NgModule({
  declarations: [
    EployerJobOffer,
  ],
  imports: [
    IonicPageModule.forChild(EployerJobOffer),
  ],
})
export class EployerJobOfferModule {}
