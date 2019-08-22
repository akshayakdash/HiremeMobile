import { Component } from '@angular/core';
import { PopoverController, IonicPage, NavController, DateTime, NavParams, AlertController, Events } from 'ionic-angular';
import { DataContext } from '../../providers/dataContext.service';
import { CommonServices } from '../../providers/common.service';
import moment from 'moment';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';
@IonicPage()
@Component({
  selector: 'page-jobofferdetails',
  templateUrl: 'jobofferdetails.html'
})
export class JobOfferDetails {
  isAvailable: boolean = true;
  jobOfferId: number;
  publishedJobOfferDesc: any = null;
  title: string;
  userDetails: any = {};
  jobTasks: any = [];
  loggedInUserDetails: any = {};
  labelList:any = [];
  phone: any;
  email: any;
  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,
    public _dataContext: DataContext,
    private commonService: CommonServices,
    public alertCtrl: AlertController,
    public events: Events,private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices
  ) {
   // this.labelList = enLanguageServices.getLabelLists();

    this.jobOfferId = this.navParam.get("jobOfferId");

    //this.userDetails = this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
  }
  ionViewDidEnter() {
    this.getLoggedInUserDetailsFromCache();
  }
  getLoggedInUserDetailsFromCache() {
    //this.loggedInUserDetails = JSON.parse(localStorage.getItem("loggedInUserCredential"));;
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
      .then((result) => {
        if (result && result.userId) {
          this.loggedInUserDetails = result;
          this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
          .then((result) => {
            if (result && result.language) {
              if (result.language == "en") {
                this.labelList = this.enLanguageServices.getLabelLists();
              } else {
                this.labelList = this.frLanguageServices.getLabelLists();
              }

              this.getJobOfferDescription();
              
            }
          });


         
        }
        else {
          this.navCtrl.setRoot("LoginPage");
        }
      });
  }
  getJobOfferDescription() {
    this._dataContext.GetJobOfferDescription(this.jobOfferId)
      .subscribe(response => {
        if (response && response != null) {
          this.publishedJobOfferDesc = response;
          this.title = this.publishedJobOfferDesc.Job.JobName;

          if(this.publishedJobOfferDesc.Employer.ContactOption!=null){
            let contactInfo = this.publishedJobOfferDesc.Employer.ContactOption.split(",");
            if (contactInfo.length > 1) {
              if (this.publishedJobOfferDesc.Employer.ContactOption.split(",")[0] == "Phone")
                this.phone = this.publishedJobOfferDesc.Employer.ContactOption.split(",")[0];
              if (this.publishedJobOfferDesc.Employer.ContactOption.split(",")[1] == "Phone")
                this.phone = this.publishedJobOfferDesc.Employer.ContactOption.split(",")[1];
              if (this.publishedJobOfferDesc.Employer.ContactOption.split(",")[0] == "Email")
                this.email = this.publishedJobOfferDesc.Employer.ContactOption.split(",")[0];
              if (this.publishedJobOfferDesc.Employer.ContactOption.split(",")[1] == "Email")
                this.email = this.publishedJobOfferDesc.Employer.ContactOption.split(",")[1];
            }
            else if (contactInfo.length == 1) {
              if (this.publishedJobOfferDesc.Employer.ContactOption == "Phone")
                this.phone = this.publishedJobOfferDesc.Employer.ContactOption;
              else
                this.email = this.publishedJobOfferDesc.Employer.ContactOption;
            }
          }

          //if (this.publishedJobOfferDesc.Employer)
          this.publishedJobOfferDesc.Disponibility = moment(this.publishedJobOfferDesc.Disponibility).format("DD-MMM-YYYY");
          this.publishedJobOfferDesc.JobOfferJobTasks.forEach(element => {
            element.JobTask.IconImage = element.JobTask.IconImage.substr(1, element.JobTask.IconImage.length)
            element.JobTask.SubTasks.forEach(element1 => {
              element1.IconImage = element1.IconImage.substr(1, element1.IconImage.length)
            });
          });
          this.jobTasks = this.publishedJobOfferDesc.Job.JobTasks;
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg33, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg33, 0);
        });
  }

  checkIfExists(job) {
    var arr = this.publishedJobOfferDesc.JobOfferJobTasks.map(t => {return t.JobTaskId});
    if(this.publishedJobOfferDesc.JobOfferJobTasks.map(t => {return t.JobTaskId}).indexOf(job.JobTaskId) !== -1){
        job.Selected = true;
    };
    return true;
  }

  validateJobOffer() {
    this._dataContext.ValidateJobOffer(this.publishedJobOfferDesc.JobOfferId)
      .subscribe(response => {
        if (response.Status == "OK") {
          this.commonService.onMessageHandler(response.Message, 1);
          // this.getUnverifiedJobOffersForAdmin();
          this.events.publish('jobofferdetailpage', Date());
          this.navCtrl.pop();
        }
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg28, 0);
        });
  }

  verify() {
    const confirm = this.alertCtrl.create({
      title: this.labelList.label106,
      message: this.labelList.label107,
      buttons: [
        {
          text: this.labelList.label59,
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: this.labelList.label60,
          handler: () => {
            this.validateJobOffer();
          }
        }
      ]
    });
    confirm.present();
  }
}
