import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobCategory } from './jobcategories';

@NgModule({
  declarations: [
    JobCategory,
  ],
  imports: [
    IonicPageModule.forChild(JobCategory),
  ],
})
export class JobCategoryModule {}
