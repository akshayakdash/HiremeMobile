import { Component } from '@angular/core';
import { PopoverController, IonicPage, NavController, DateTime, NavParams, AlertController } from 'ionic-angular';
//import { PublishedJobModel } from '../../interfaces/publishedjob';
import { ModalController, ViewController } from 'ionic-angular';
import { CommonServices } from '../../providers/common.service';
import { DataContext } from '../../providers/dataContext.service';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';
import moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-publishedjob',
  templateUrl: 'publishedjob.html'
})
export class PublishedJob {
  isAvailable: boolean = true;
  publishedJobResult: any = [];
  searchFilterData: any = {
    Job: 0
  };
  tapOption = [];
  tabValue: string;
  loggedInUserDetails: any = {};
  title: string;
  labelList:any = [];
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParam: NavParams,
    public _dataContext: DataContext,
    private commonService: CommonServices,
    public alertCtrl: AlertController,
    private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices
  ) {
    //this.labelList = enLanguageServices.getLabelLists();
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
    .then((result) => {
      if (result && result.language) {
        if (result.language == "en") {
          this.labelList = this.enLanguageServices.getLabelLists();
        } else {
          this.labelList = this.frLanguageServices.getLabelLists();
        }
        this.tapOption = [{ Value: this.labelList.label74, Key: "JobRequest" }, { Value: this.labelList.label75, Key: "JobOffer" }];
      }
    });
    
    this.searchFilterData.Job = this.navParam.get("jobId");
    this.title = this.navParam.get("jobName");
    this.publishedJobResult = [];
    

  }
  ionViewDidEnter() {
    if(this.publishedJobResult.length ==0){
      this.tabValue = "JobRequest";
      this.getLoggedInUserDetailsFromCache();
    }
    
  }
  getLoggedInUserDetailsFromCache() {
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
    .then((result) => {
      if (result && result.userId) {
        this.loggedInUserDetails = result;
        this.getPublishedJobRequest();
      }
      else {
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }
  getPublishedJobRequest() {
    this._dataContext.GetPublishedJobRequestByJobId(this.searchFilterData)
      .subscribe(response => {
        if (response.length > 0) {

          this.isAvailable = true;
          // response.forEach(element => {
          //   if(element.VerifiedByAdmin){
          //     this.publishedJobResult.push(element);
          //   }
          // });
          this.publishedJobResult = response;
          this.publishedJobResult.forEach(element => {
            element.PublishedDate = moment(element.PublishedDate).format("DD-MMM-YYYY");
          });
        }
        else {
          this.isAvailable = false;
          this.commonService.onMessageHandler(this.labelList.errormsg12, 0);
        }
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg13, 0);
        });
  }
  getPublishedJobReponse() {
    this._dataContext.GetPublishedJobReponseByJobId(this.searchFilterData)
      .subscribe(response => {
        if (response.length > 0) {
          this.isAvailable = true;
          this.publishedJobResult = response;
          this.publishedJobResult.forEach(element => {
            element.PublishedDate = moment(element.PublishedDate).format("DD-MMM-YYYY");
          });
        }
        else {
          this.isAvailable = false;
          this.commonService.onMessageHandler(this.labelList.errormsg12, 0);
        }
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg13, 0);
        });
  }
  selectedJobRequestDetails(value) {
    this.navCtrl.push("JobRequestDescDetails", { jobRequestId: value.JobRequestId });
    // this.navCtrl.push("PublishedJobDesc", value);
  }
  selectedJobOfferDetails(value) {
    this.navCtrl.push("JobOfferDetails", { jobOfferId: value.JobofferId });
    // this.navCtrl.push("PublishedJobDesc", value);
  }

  makeFavourite(id) {
    const confirm = this.alertCtrl.create({
      title: this.labelList.label57,
      message: this.loggedInUserDetails.type=='Employer'?this.labelList.label165: this.labelList.label58,
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
            if(this.loggedInUserDetails.type=='Employer'){
              this._dataContext.MakeJobRequestAsFavourite(this.loggedInUserDetails.userId, id)
              .subscribe(response => {
                if (response.length > 0) {
                  this.commonService.onMessageHandler(this.labelList.successmsg2, 1);
                }
                else
                  this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
              },
                error => {
                  this.commonService.onMessageHandler(this.labelList.errormsg14, 0);
                });
            }
            if(this.loggedInUserDetails.type=='Employee'){
              this._dataContext.MakeJobOfferAsFavourite(this.loggedInUserDetails.userId, id)
              .subscribe(response => {
                if (response.length > 0) {
                  this.commonService.onMessageHandler(this.labelList.successmsg2, 1);
                }
                else
                  this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
              },
                error => {
                  this.commonService.onMessageHandler(this.labelList.errormsg14, 0);
                });
            }
            

          }
        }
      ]
    });
    confirm.present();

  }
  //While Tab change
  tabSelection(event, option) {
    this.publishedJobResult = [];
    if (option == 0) {
      this.tabValue = "JobRequest";
      this.getPublishedJobRequest();
    }
    else {
      this.tabValue = "JobOffer";
      this.getPublishedJobReponse();
    }
  }

  openFilter() {
    let index = 0;
    if (this.tabValue == "JobRequest") {
      index = 0;
    } else {
      index = 1;
    }
  
    let filterModal = this.modalCtrl.create("FilterPage", { activeTab: index,Job:this.searchFilterData.Job,JobName:this.title });
    filterModal.onDidDismiss(item => {
      if (item) {
        this.isAvailable = true;
        this.publishedJobResult = item;
        this.publishedJobResult.forEach(element => {
          element.PublishedDate = moment(element.PublishedDate).format("DD-MMM-YYYY");
        });
      }
    })
    filterModal.present();
  }
  gotoAgencydetailsPage(item){
    this.navCtrl.push("AgencydetailsPage", { AgencyId: item.AgencyId });
  }
}
