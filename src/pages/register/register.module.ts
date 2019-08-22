import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPage } from './register';
import { RecaptchaModule } from 'ng-recaptcha';
@NgModule({
  declarations: [
    RegisterPage,
  ],
  imports: [
    RecaptchaModule.forRoot(),
    IonicPageModule.forChild(RegisterPage),
  ],
})
export class RegisterPageModule {}
