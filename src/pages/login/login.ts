import { Component } from '@angular/core';
import { NavController, IonicPage, Events } from 'ionic-angular';
import { DataContext } from '../../providers/dataContext.service';
import { CommonServices } from '../../providers/common.service';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  gender: string = "f";
  login = {
    UserName: "",
    Password: ""
  }
  loggedInUserDetails: any = {};
  labelList: any = [];

  constructor(public navCtrl: NavController,
    public events: Events,
    public _dataContext: DataContext,
    private commonService: CommonServices,
    private enLanguageServices: EnLanguageServices,
    private frLanguageServices: FrLanguageServices) {

   
      // this.events.subscribe('user1:languagechanged', (language, time) => {
      //   if (language == "en") {
      //     this.labelList = enLanguageServices.getLabelLists();
      //   } else {
      //     this.labelList = frLanguageServices.getLabelLists();
      //   }
      // });
  }

  ionViewDidEnter() {
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
    .then((result) => {
      if (result && result.language) {
        if (result.language == "en") {
          this.labelList = this.enLanguageServices.getLabelLists();
        } else {
          this.labelList = this.frLanguageServices.getLabelLists();
        }
        this.commonService.clearAllCache().then(res=>{
          this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getLanguageSelected"), { language: result.language,Accessed : result.Accessed });
        });
        
      }else{
        this.labelList = this.frLanguageServices.getLabelLists();
      }
    });

  }
  onLogin() {
    this._dataContext.LoginUser(this.login)
      .subscribe(response => {
        this.onSetAuthToken({ userId: response.UserId, type: response.Role, email: response.Email, userName: response.UserName });
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg1, 0);
        });
  }
  onSetAuthToken(response) {
    this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"), response).then(res => {
      //this.gotoDashboard();
      this.events.publish('user:loginsuccessfully', response.Role, Date.now());
    });
  }
  gotoDashboard() {
    this.navCtrl.setRoot("DashboardPage");
  }
  gotoRegister() {
    this.navCtrl.setRoot("RegisterPage");
  }
  gotoForgotPassword() {
    this.navCtrl.setRoot("ForgotpasswordPage");
  }


}