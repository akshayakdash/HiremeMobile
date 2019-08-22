import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppStartUp } from './appstartup';

@NgModule({
  declarations: [
    AppStartUp,
  ],
  imports: [
    IonicPageModule.forChild(AppStartUp),
  ],
})
export class AppStartUpModule {}
