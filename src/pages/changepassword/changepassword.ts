import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataContext } from '../../providers/dataContext.service';
import { CommonServices } from '../../providers/common.service';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';
@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
  passwordObj: any = {
   // Email: "",
   OldPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
   // Code: "1234"
  };
  loggedInUserDetails: any = {};
  labelList:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public _dataContext: DataContext, 
    private commonService: CommonServices,
    private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices) {
   // this.labelList = enLanguageServices.getLabelLists();
    this.getLoggedInUserDetailsFromCache();
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
  getLoggedInUserDetailsFromCache() {
    //this.loggedInUserDetails = JSON.parse(localStorage.getItem("loggedInUserCredential"));;
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
      .then((result) => {
        if (result && result.userId) {
          this.loggedInUserDetails = result;
          //this.getProfileDetails();
        }
        else {
          this.navCtrl.setRoot("LoginPage");
        }
      });
  }
  resetPassword() {

    if (this.loggedInUserDetails.type == "Employee") {
      this.updateEmployeePassword();
    } else if (this.loggedInUserDetails.type == "Employer") {
      this.updateEmployerPassword();
    } else if (this.loggedInUserDetails.type == "Agency") {
      this.updateAgencyPassword();
    }

  }
  updateEmployeePassword(){
    if (this.passwordObj.NewPassword == this.passwordObj.ConfirmPassword) {
      this._dataContext.updateEmployeePassword(this.loggedInUserDetails.userId,this.passwordObj)
        .subscribe(response => {
          if (response.Status == "OK") {
            this.commonService.onMessageHandler(response.Message, 1);
          } else {
            this.commonService.onMessageHandler(response.Message, 0);
          }
        },
          error => {
            this.commonService.onMessageHandler("Failed to reset password. Please try again", 0);
          });
    } else {
      this.commonService.onMessageHandler("Password and confirm password didnot match", 0);
    }
  }
  updateEmployerPassword(){
    if (this.passwordObj.NewPassword == this.passwordObj.ConfirmPassword) {
      this._dataContext.updateEmployerPassword(this.loggedInUserDetails.userId,this.passwordObj)
        .subscribe(response => {
          if (response.Status == "OK") {
            this.commonService.onMessageHandler(response.Message, 1);
          } else {
            this.commonService.onMessageHandler(response.Message, 0);
          }
        },
          error => {
            this.commonService.onMessageHandler("Failed to reset password. Please try again", 0);
          });
    } else {
      this.commonService.onMessageHandler("Password and confirm password didnot match", 0);
    }
  }
  updateAgencyPassword(){
    if (this.passwordObj.NewPassword == this.passwordObj.ConfirmPassword) {
      this._dataContext.updateAgencyPassword(this.loggedInUserDetails.userId,this.passwordObj)
        .subscribe(response => {
          if (response.Status == "OK") {
            this.commonService.onMessageHandler(response.Message, 1);
          } else {
            this.commonService.onMessageHandler(response.Message, 0);
          }
        },
          error => {
            this.commonService.onMessageHandler("Failed to reset password. Please try again", 0);
          });
    } else {
      this.commonService.onMessageHandler("Password and confirm password didnot match", 0);
    }
  }
}
