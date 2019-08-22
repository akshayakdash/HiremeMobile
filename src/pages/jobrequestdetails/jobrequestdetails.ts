import { Component } from '@angular/core';
import { PopoverController, IonicPage, NavController, DateTime, NavParams, AlertController, Events } from 'ionic-angular';
import { DataContext } from '../../providers/dataContext.service';
import { CommonServices } from '../../providers/common.service';
import moment from 'moment';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';
import { ImageViewerController } from 'ionic-img-viewer';
@IonicPage()
@Component({
  selector: 'page-jobrequestdetails',
  templateUrl: 'jobrequestdetails.html'
})
export class JobRequestDescDetails {
  _imageViewerCtrl: ImageViewerController;
  isAvailable: boolean = true;
  jobRequestId: number;
  publishedJobRequestDesc: any = null;
  title: string;
  userDetails: any = {};
  jobTasks: any = [];
  labelList: any = [];
  phone: any;
  email: any;
  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,
    public _dataContext: DataContext,
    private commonService: CommonServices,
    public alertCtrl: AlertController,
    public events: Events, private enLanguageServices: EnLanguageServices,
    private frLanguageServices: FrLanguageServices,
    imageViewerCtrl: ImageViewerController
  ) {
    this._imageViewerCtrl = imageViewerCtrl;
    // this.labelList = enLanguageServices.getLabelLists();

    this.jobRequestId = this.navParam.get("jobRequestId");
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
          this.userDetails = result;
          this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
            .then((result) => {
              if (result && result.language) {
                if (result.language == "en") {
                  this.labelList = this.enLanguageServices.getLabelLists();
                } else {
                  this.labelList = this.frLanguageServices.getLabelLists();
                }
                this.getJobRequestDescription();
              }
            });

        }
        else {
          this.navCtrl.setRoot("LoginPage");
        }
      });
  }
  getJobRequestDescription() {
    this._dataContext.GetJobRequestDescription(this.jobRequestId)
      .subscribe(response => {
        if (response && response != null) {
          this.publishedJobRequestDesc = response;
          this.title = this.publishedJobRequestDesc.Job.JobName;
          if(this.publishedJobRequestDesc.Candidate.ContactOption!=null){
            let contactInfo = this.publishedJobRequestDesc.Candidate.ContactOption.split(",");
            if (contactInfo.length > 1) {
              if (this.publishedJobRequestDesc.Candidate.ContactOption.split(",")[0] == "Phone")
                this.phone = this.publishedJobRequestDesc.Candidate.ContactOption.split(",")[0];
              if (this.publishedJobRequestDesc.Candidate.ContactOption.split(",")[1] == "Phone")
                this.phone = this.publishedJobRequestDesc.Candidate.ContactOption.split(",")[1];
              if (this.publishedJobRequestDesc.Candidate.ContactOption.split(",")[0] == "Email")
                this.email = this.publishedJobRequestDesc.Candidate.ContactOption.split(",")[0];
              if (this.publishedJobRequestDesc.Candidate.ContactOption.split(",")[1] == "Email")
                this.email = this.publishedJobRequestDesc.Candidate.ContactOption.split(",")[1];
            }
            else if (contactInfo.length == 1) {
              if (this.publishedJobRequestDesc.Candidate.ContactOption == "Phone")
                this.phone = this.publishedJobRequestDesc.Candidate.ContactOption;
              else
                this.email = this.publishedJobRequestDesc.Candidate.ContactOption;
            }
          }
          

          if (this.publishedJobRequestDesc.Candidate)
            this.publishedJobRequestDesc.Candidate.Disponibility = moment(this.publishedJobRequestDesc.Candidate.Disponibility).format("DD-MMM-YYYY");

          this.publishedJobRequestDesc.JobRequestJobTasks.forEach(element => {
            element.JobTask.IconImage = element.JobTask.IconImage.substr(1, element.JobTask.IconImage.length)
            element.JobTask.SubTasks.forEach(element1 => {
              element1.IconImage = element1.IconImage.substr(1, element1.IconImage.length)
            });
          });
          this.publishedJobRequestDesc.UserFeedbacks.forEach(element => {
            element.CreatedDate = moment(element.CreatedDate).format("DD MMM YYYY");
          });
          this.jobTasks = this.publishedJobRequestDesc.Job.JobTasks;
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg34, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg34, 0);
        });
  }
  validateJobRequest() {
    this._dataContext.ValidateJobRequest(this.publishedJobRequestDesc.JobRequestId)
      .subscribe(response => {
        if (response.Status == "OK") {
          this.commonService.onMessageHandler(response.Message, 1);
          // this.getUnverifiedJobRequestsForAdmin();
          this.events.publish('reloadPage1', Date());
          this.navCtrl.pop();
        }
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg29, 0);
        });
  }
  Verify() {
    const confirm = this.alertCtrl.create({
      title: this.labelList.label104,
      message: this.labelList.label104,
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
            this.validateJobRequest();
          }
        }
      ]
    });
    confirm.present();
  }
  checkIfExists(job) {

  //   var arr = this.publishedJobRequestDesc.JobRequestJobTasks.map(t => { return t.TaskResponse });
  //   console.log(arr);
  //  // var test = "";
  //   if (this.publishedJobRequestDesc.JobRequestJobTasks.map(t => { return t.JobTaskId }).indexOf(job.JobTaskId) !== -1) {
  //    // job["TaskResponse"] = test;
      
  //   };
    this.publishedJobRequestDesc.JobRequestJobTasks.forEach(element => {

      if(element.JobTaskId == job.JobTaskId){
        job.Selected = true;
        job["TaskResponse"] = element.TaskResponse;
         
      }
      
    });
    //job["TaskResponse"] = arr[0];
    //return true;
  }
  getDesc(job){
   // var test = "";
    

  }
  presentImage(myImage) {

    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();

    // setTimeout(() => imageViewer.dismiss(), 1000);
    // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }
}
