import { Component, ViewChild, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController, ModalController } from 'ionic-angular';
import { DataContext } from '../../../providers/dataContext.service';
import { CommonServices } from '../../../providers/common.service';
import moment from 'moment';
import { EnLanguageServices } from '../../../providers/enlanguage.service';
import { FrLanguageServices } from '../../../providers/frlanguage.service';

@IonicPage()
@Component({
  selector: 'page-favouritejobrequest',
  templateUrl: 'favouritejobrequest.html',
})
export class EmployerFavouriteJobRequest {

  @ViewChild(Slides) slides: Slides;
  public selectedCategory: any;
  public categories: Array<any>;
  public showLeftButton: boolean;
  public showRightButton: boolean;
  tabValue: number;
  isAvailable: boolean = true;
  publishedJobResult: any = [];
  allMyJobRequestList: any = [];
  loggedInUserDetails: any = {};
  myJobRequestListByCategoryId: any = [];
  labelList:any = [];
  constructor(public injector: Injector, public navCtrl: NavController,
    public navParams: NavParams,
    public _dataContext: DataContext,
    private commonService: CommonServices, public alerCtrl: AlertController,public modalCtrl: ModalController,
    private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices) {
     // this.labelList = enLanguageServices.getLabelLists();
    this.publishedJobResult = [];
  }
  // ...
  ionViewWillEnter() {
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
    this.getLoggedInUserDetailsFromCache();
  }
  getLoggedInUserDetailsFromCache() {
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
      .then((result) => {
        if (result && result.userId) {
          this.loggedInUserDetails = result;
          this.getActiveCategories();
        }
        else {
          this.navCtrl.setRoot("LoginPage");
        }
      });
  }
  //Get all active categories for search job
  getActiveCategories() {
    this._dataContext.GetActiveCategories()
      .subscribe(response => {
        if (response.length > 0) {
          this.categories = response;
          this.selectedCategory = this.categories[0];
          this.getMyFavJobRequest();
          //this.filterDataBySelectedCategory(this.categories[0].JobCategoryId);
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg11, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg10, 0);
        });
  }
  public filterDataBySelectedCategory(categoryId: number): void {
    this.isAvailable = true;
    // Handle what to do when a category is selected
    this.myJobRequestListByCategoryId = [];
    let pageNo = categoryId - 1;
    this.slides.slideTo(pageNo, 500);
    this.allMyJobRequestList.filter(item => {
      if (item.Job.JobCategoryId == categoryId)
        this.myJobRequestListByCategoryId.push(item);
    });
    if( this.myJobRequestListByCategoryId.length == 0){
      this.isAvailable = false;
    }
  }
  getMyFavJobRequest() {
    this._dataContext.GetMyFavJobRequestForEmployer(this.loggedInUserDetails.userId)
      .subscribe(response => {
        if (response.length > 0) {
          this.isAvailable = true;
          this.allMyJobRequestList = response;
          this.allMyJobRequestList.forEach(element => {
            element.PublishedDate = moment(element.PublishedDate).format("DD-MMM-YYYY");
            element.ProfilePicUrl = "data:image/png;base64," + element.Candidate.ProfilePicUrl;
          });
          this.filterDataBySelectedCategory(this.categories[0].JobCategoryId);
        }
        else {
          this.myJobRequestListByCategoryId = [];
          this.isAvailable = false;
          this.commonService.onMessageHandler(this.labelList.errormsg17, 0);
        }
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
        });
  }
  private initializeCategories(): void {

    // Select it by defaut
    this.selectedCategory = this.categories[0];

    // Check which arrows should be shown
    this.showLeftButton = false;
    this.showRightButton = this.categories.length > 3;
  }

  public filterData(categoryId: number): void {
    // Handle what to do when a category is selected
    let pageNo = categoryId - 1;
    this.slides.slideTo(pageNo, 500);

  }

  // Method executed when the slides are changed
  public slideChanged(): void {
    let currentIndex = this.slides.getActiveIndex();
    // this.showLeftButton = currentIndex !== 0;
    // this.showRightButton = currentIndex !== Math.ceil(this.slides.length() / 3);
  }

  // Method that shows the next slide
  public slideNext(): void {
    this.slides.slideNext();
  }

  // Method that shows the previous slide
  public slidePrev(): void {
    this.slides.slidePrev();
  }
  gotoCreate() {
    this.navCtrl.push("JobCategory", { category: this.categories });
  }
  gotoDetails() {
    // this.navCtrl.push("JobRequestDescDetails",{jobRequestId:});
  }
  getSelectedDetails(id) {
    this.navCtrl.push("JobRequestDescDetails", { jobRequestId: id });
  }
  deleteSelectedJobRequests(id, index) {
    let method = this.alerCtrl.create({
      title: this.labelList.label78,
      message: this.labelList.label79,
      cssClass: 'alert-header-back-style',
      buttons: [
        {
          text: this.labelList.label80,
          cssClass: 'cancel-btn-style',
          handler: () => {
            // return false;
          }
        },
        {
          text: this.labelList.label77,
          cssClass: 'ok-btn-style',
          handler: () => {
            this._dataContext.DeleteFavouriteJobRequestForEmployee(this.loggedInUserDetails.userId, id)
              .subscribe(response => {
                  this.myJobRequestListByCategoryId.splice(index, 1);
                  this.getActiveCategories();
                  // this.allMyJobRequestList.filter((item, index) => {
                  //   if (item.JobCategoryId == id) {
                  //     this.allMyJobRequestList.splice(this.allMyJobRequestList, 1);
                  //   }
                  // });
                  this.commonService.onMessageHandler(this.labelList.successmsg4, 1);
               
              },
                error => {
                  this.commonService.onMessageHandler(this.labelList.errormsg18, 0);
                });
          }
        }
      ]
    });
    method.present();
  }
  addNote(offer){
    console.log(offer)
    //this.loggedInUserDetails.userId
    let filterModal = this.modalCtrl.create("JobRequestNotePage",{
      info:offer,
      userId:this.loggedInUserDetails.userId
    });
      filterModal.onDidDismiss(item => {
        if (item) {
          //this.members = item.Members;
         // this.searchParam = item.SearchParam
        }
      })
      filterModal.present();
  }
}
