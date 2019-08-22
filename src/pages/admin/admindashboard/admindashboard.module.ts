import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdmindashboardPage } from './admindashboard';

@NgModule({
  declarations: [
    AdmindashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(AdmindashboardPage),
  ],
})
export class AdmindashboardPageModule {}
