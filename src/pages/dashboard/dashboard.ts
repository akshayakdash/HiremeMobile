import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';
import { CommonServices } from '../../providers/common.service';
import { DataContext } from '../../providers/dataContext.service';
@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  labelList:any = [];
  lanuageSelected = "en"
  userDetails: any = {};
  loggedInUserDetails: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events,
    public _dataContext: DataContext,
    private commonService: CommonServices,
    private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices) {
     // this.labelList = enLanguageServices.getLabelLists();
  }

  ionViewDidLoad() {
    this.getLoggedInUserDetailsFromCache();
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
    .then((result) => {
      if (result && result.language) {
        if (result.language == "en") {
          this.lanuageSelected = "en";
          this.labelList = this.enLanguageServices.getLabelLists();
        } else {
          this.lanuageSelected = "fr";
          this.labelList = this.frLanguageServices.getLabelLists();
        }
        
      }
    });
    console.log('ionViewDidLoad DashboardPage');
  }
  getLoggedInUserDetailsFromCache() {
    //this.loggedInUserDetails = JSON.parse(localStorage.getItem("loggedInUserCredential"));;
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
      .then((result) => {
        if (result && result.userId) {
          this.loggedInUserDetails = result;
          this.getProfileDetails();
        }
        else {
          this.navCtrl.setRoot("LoginPage");
        }
      });
  }
  getProfileDetails() {


    if (this.loggedInUserDetails.type == "Employee") {
      this.getEmployeeProfile();
      
    } else if (this.loggedInUserDetails.type == "Employer") {
      this.getEmployerProfile();
    } else if (this.loggedInUserDetails.type == "Agency") {
      this.getAgencyProfile();
    }




  }
  getEmployeeProfile() {
    this._dataContext.CandidateProfileById(this.loggedInUserDetails.userId)
      .subscribe(response => {
        this.userDetails = response;
        this.events.publish('profilepic', this.userDetails.profile_pic_base64, Date.now());
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg22, 0);
        });
  }

  getEmployerProfile() {
    this._dataContext.GetEmployerProfileDetails(this.loggedInUserDetails.userId)
      .subscribe(response => {
        this.userDetails = response;
        this.events.publish('profilepic', this.userDetails.profile_pic_base64, Date.now());
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg22, 0);
        });
  }

  getAgencyProfile() {
    this._dataContext.GetAgencyProfileDetails(this.loggedInUserDetails.userId)
      .subscribe(response => {
        this.userDetails = response;
        this.events.publish('profilepic', this.userDetails.profile_pic_base64, Date.now());
        
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg22, 0);
        });
  }
}
