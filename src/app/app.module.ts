import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
//import { HomePage } from '../pages/home/home';
//import { ListPage } from '../pages/list/list';
//import { LoginPage } from '../pages/login/login';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { CommonServices } from '../providers/common.service';
import { DataContext } from '../providers/dataContext.service';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CacheModule } from 'ionic-cache';
import { HttpService } from '../providers/http.service';
import { EnLanguageServices } from '../providers/enlanguage.service';
import { FrLanguageServices } from '../providers/frlanguage.service';
import { RecaptchaModule } from 'ng-recaptcha';
@NgModule({
  declarations: [
    MyApp
    //HomePage,
    //ListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RecaptchaModule.forRoot(),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    IonicImageViewerModule,
    CacheModule.forRoot(),
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
   // HomePage,
    //ListPage
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CommonServices,
    DataContext,
    HttpService,
    EnLanguageServices,
    FrLanguageServices,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
