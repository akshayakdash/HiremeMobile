import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataContext } from '../../providers/dataContext.service';
import { CommonServices } from '../../providers/common.service';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  passwordObj: any = {
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Code: ""
  };
  isOtp: boolean=false;
  labelList:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public _dataContext: DataContext, 
    private commonService: CommonServices,private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices) {
     // this.labelList = enLanguageServices.getLabelLists();
    // this.getLoggedInUserDetailsFromCache();
  }

  ionViewDidLoad() {
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
    .then((result) => {
      if (result && result.language) {
        if (result.language == "en") {
          this.labelList = this.enLanguageServices.getLabelLists();
        } else {
          this.labelList = this.frLanguageServices.getLabelLists();
        }
        
      }
    });
    console.log('ionViewDidLoad ChangepasswordPage');
  }

  forgotPassword() {
    //this.passwordObj.Email = this.loggedInUserDetails.email;
    if (this.passwordObj.Email != "") {
      this._dataContext.ForgotPassword(this.passwordObj)
        .subscribe(response => {
          if (response.Status == "OK") {
            this.passwordObj.Code = "";
            this.isOtp = true;

            this.commonService.onMessageHandler(response.Message, 1);
          } else {
            this.commonService.onMessageHandler(response.Message, 0);
          }
        },
          error => {
            this.commonService.onMessageHandler(this.labelList.errormsg8, 0);
          });
    } else {
      this.commonService.onMessageHandler(this.labelList.validmsg10, 0);
    }

  }
  resetPassword() {
    // this.passwordObj.Email = this.loggedInUserDetails.email;
    if (this.passwordObj.Code != "") {
      if (this.passwordObj.Password == this.passwordObj.ConfirmPassword) {
        this._dataContext.ResetPassword(this.passwordObj)
          .subscribe(response => {
            if (response.Status == "OK") {
              this.commonService.onMessageHandler(response.Message, 1);
              this.navCtrl.setRoot("LoginPage");
            } else {
              this.commonService.onMessageHandler(response.Message, 0);
            }
          },
            error => {
              this.commonService.onMessageHandler(this.labelList.errormsg8, 0);
            });
      } else {
        this.commonService.onMessageHandler(this.labelList.validmsg16, 0);
      }
    }
    else{
      this.commonService.onMessageHandler(this.labelList.validmsg26, 0);
    }
 

  }
  gotoLogin() {
    this.navCtrl.setRoot("LoginPage");
  }
}

