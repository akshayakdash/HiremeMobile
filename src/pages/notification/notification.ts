import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataContext } from '../../providers/dataContext.service';
import { CommonServices } from '../../providers/common.service';
import moment from 'moment';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  loggedInUserDetails: any = {};
  notificationList: any = [];
  isAvailable: boolean = true;
  labelList:any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _dataContext: DataContext,
    private commonService: CommonServices,
    private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices
  ) {
  //  this.labelList = enLanguageServices.getLabelLists();
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
  }


  ionViewWillEnter() {
    this.getLoggedInUserDetailsFromCache();
  }
  getLoggedInUserDetailsFromCache() {
    //this.loggedInUserDetails = JSON.parse(localStorage.getItem("loggedInUserCredential"));;
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
      .then((result) => {
        if (result && result.userId) {
          this.loggedInUserDetails = result;
          this.getNotification();
        }
        else {
          this.navCtrl.setRoot("LoginPage");
        }
      });
  }
  getNotification() {
    if (this.loggedInUserDetails.type == "Employee") {
      this._dataContext.GetActiveNotificationByUserId(this.loggedInUserDetails.userId)
        .subscribe(response => {
          if (response.length > 0) {
            this.isAvailable = true;
            this.notificationList = response;
            this.notificationList.forEach(element => {
              element.CreatedDate = moment(element.CreatedDate).format("DD-MMM-YYYY");
            });
          }
          else {
            this.isAvailable = false;
            this.commonService.onMessageHandler(this.labelList.errormsg20, 0);
          }
        },
          error => {
            this.commonService.onMessageHandler(this.labelList.errormsg21, 0);
          });
    } else if (this.loggedInUserDetails.type == "Employer") {
      this._dataContext.GetEmployerNotificationDetails(this.loggedInUserDetails.userId)
        .subscribe(response => {
          if (response.length > 0) {
            this.isAvailable = true;
            this.notificationList = response;
            this.notificationList.forEach(element => {
              element.CreatedDate = moment(element.CreatedDate).format("DD-MMM-YYYY");
            });
          }
          else {
            this.isAvailable = false;
            this.commonService.onMessageHandler(this.labelList.errormsg20, 0);
          }
        },
          error => {
            this.commonService.onMessageHandler(this.labelList.errormsg21, 0);
          });
    } else if (this.loggedInUserDetails.type = "Agency") {
      this._dataContext.GetAgencyNotificationDetails(this.loggedInUserDetails.userId)
      .subscribe(response => {
        if (response.length > 0) {
          this.isAvailable = true;
          this.notificationList = response;
          this.notificationList.forEach(element => {
            element.CreatedDate = moment(element.CreatedDate).format("DD-MMM-YYYY");
          });
        }
        else {
          this.isAvailable = false;
          this.commonService.onMessageHandler(this.labelList.errormsg20, 0);
        }
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg21, 0);
        });
    }

  }
}
