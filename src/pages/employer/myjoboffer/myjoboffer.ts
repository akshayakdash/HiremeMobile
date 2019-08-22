import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { DataContext } from '../../../providers/dataContext.service';
import { CommonServices } from '../../../providers/common.service';
import moment from 'moment';
import { AlertController } from 'ionic-angular';
import { EnLanguageServices } from '../../../providers/enlanguage.service';
import { FrLanguageServices } from '../../../providers/frlanguage.service';
@IonicPage()
@Component({
  selector: 'page-myjoboffer',
  templateUrl: 'myjoboffer.html',
})
export class EployerJobOffer {
  @ViewChild(Slides) slides: Slides;
  public selectedCategory: any;
  public categories: Array<any> = [];
  public showLeftButton: boolean;
  public showRightButton: boolean;
  selectedJobByCategoryId: Array<any> = [];
  employeeJobOffers: any = [];
  loggedInUserDetails: any = {};
  _imageViewerCtrl: ImageViewerController;
  employeeJobOfferList: any = [];
  joboffers: any = [];
  isAvailable: boolean = true;
  allJobOffersList: any = [];
  labelList: any = [];
  constructor(public alerCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, imageViewerCtrl: ImageViewerController,
    public _dataContext: DataContext, private commonService: CommonServices, public alertCtrl: AlertController,
    private enLanguageServices: EnLanguageServices,
    private frLanguageServices: FrLanguageServices) {
    //   this.labelList = enLanguageServices.getLabelLists();
    this._imageViewerCtrl = imageViewerCtrl;
  }

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

  gotoDetails(item) {
    this.navCtrl.push("JobOfferDetails", { jobOfferId: item.JobofferId });
  }
  gotoCreateJobOffer() {
    this.navCtrl.push("JobCategory", { category: this.categories, fromPage: "jobResponse" });
  }
  getActiveCategories() {
    this._dataContext.GetActiveCategories()
      .subscribe(response => {
        if (response.length > 0) {
          this.categories = response;
          this.selectedCategory = this.categories[0];
          // this.filterDataBySelectedCategory(this.categories[0].JobCategoryId);
          this.getEmployeeJobOffers();
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg11, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg10, 0);
        });
  }
  getEmployeeJobOffers() {
    this._dataContext.GetMyJobOfferForEmployee(this.loggedInUserDetails.userId)
      .subscribe(response => {
        if (response.length > 0) {
          this.isAvailable = true;
          this.employeeJobOfferList = response;
          this.employeeJobOfferList.forEach(element => {
            element.PublishedDate = moment(element.PublishedDate).format("DD MMM YYYY");
          });
          //this.filterDataBySelectedCategory(this.categories[0].JobCategoryId);
          ///////////////////////////////////
          this.employeeJobOffers = [];
          this.employeeJobOffers = this.employeeJobOfferList;
          if (this.employeeJobOffers.length == 0)
            this.isAvailable = false;
          else
            this.isAvailable = true;
          ///////////////////////////
        }
        else {
          this.employeeJobOfferList = [];
          this.employeeJobOffers = [];
          this.isAvailable = false;
          this.commonService.onMessageHandler(this.labelList.errormsg17, 0);
        }
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
        });
  }
  public filterDataBySelectedCategory(categoryId: number): void {
    // Handle what to do when a category is selected
    let pageNo = categoryId - 1;
    this.slides.slideTo(pageNo, 500);
    this.employeeJobOffers = [];
    this.employeeJobOfferList.filter(item => {
      if (item.JobCategoryId == categoryId)
        this.employeeJobOffers.push(item);
    });
    if (this.employeeJobOffers.length == 0)
      this.isAvailable = false;
    else
      this.isAvailable = true;
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
  deleteJobOffer(id, index) {
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
            this._dataContext.DeleteEmployerJobOfferNew(this.loggedInUserDetails.userId, id)
              .subscribe(response => {
                this.employeeJobOffers.splice(index, 1);
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
}
