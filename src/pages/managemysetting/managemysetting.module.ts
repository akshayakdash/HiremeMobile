import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagemysettingPage } from './managemysetting';
//import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    ManagemysettingPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagemysettingPage)
  ],
})
export class ManagemysettingPageModule {}
