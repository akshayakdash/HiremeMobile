import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Events } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { DataContext } from '../../../providers/dataContext.service';
import { CommonServices } from '../../../providers/common.service';
import moment from 'moment';
import { AlertController } from 'ionic-angular';
import { EnLanguageServices } from '../../../providers/enlanguage.service';
import { FrLanguageServices } from '../../../providers/frlanguage.service';

@IonicPage()
@Component({
  selector: 'page-verifyjobofferprofile',
  templateUrl: 'verifyjobofferprofile.html',
})
export class VerifyjobofferprofilePage {
  @ViewChild(Slides) slides: Slides;
  public selectedCategory: any;
  public categories: Array<any> = [];
  public showLeftButton: boolean;
  public showRightButton: boolean;
  selectedJobByCategoryId: Array<any> = [];
  _imageViewerCtrl: ImageViewerController;
  joboffers: any = [];
  loggedInUserDetails:any={};
  allJobOffersList : any = [];
  labelList:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,imageViewerCtrl: ImageViewerController,
    public _dataContext: DataContext, private commonService: CommonServices, public alertCtrl: AlertController,public events:Events,private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices) {
    //this.labelList = enLanguageServices.getLabelLists();
    this._imageViewerCtrl = imageViewerCtrl;
    this.events.subscribe('jobofferdetailpage',(time) => {
      this.getUnverifiedJobOffersForAdmin();
     });
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
  presentImage(myImage) {
  
    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();
 
    // setTimeout(() => imageViewer.dismiss(), 1000);
    // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }
  getUnverifiedJobOffersForAdmin() {
    this._dataContext.GetUnverifiedJobOffersForAdmin()
      .subscribe(response => {
        this.allJobOffersList = response;
        this.allJobOffersList.forEach(element => {
          element.PublishedDate = moment(element.PublishedDate).format("DD MMM YYYY");
        });
        this.filterDataBySelectedCategory(this.categories[0].JobCategoryId);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
        });
  }
  validateJobOffer(item) {
    this._dataContext.ValidateJobOffer(item.JobOfferId)
      .subscribe(response => {
        if (response.Status == "OK") {
          this.commonService.onMessageHandler(response.Message, 1);
          this.getUnverifiedJobOffersForAdmin();
        }
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg30, 0);
        });
  }

  verify(item) {
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
            this.validateJobOffer(item);
          }
        }
      ]
    });
    confirm.present();
  }
  gotoDetails(item){
   this.navCtrl.push("JobOfferDetails", { jobOfferId: item.JobOfferId });
  }
  getActiveCategories() {
    this._dataContext.GetActiveCategories()
      .subscribe(response => {
        if (response.length > 0) {
          this.categories = response;
          this.selectedCategory = this.categories[0];
         // this.filterDataBySelectedCategory(this.categories[0].JobCategoryId);
         this.getUnverifiedJobOffersForAdmin();
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg11, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg10, 0);
        });
  }
  public filterDataBySelectedCategory(categoryId: number): void {
    // Handle what to do when a category is selected
    let pageNo = categoryId - 1;
    this.slides.slideTo(pageNo, 500);
    this.joboffers = [];
    this.allJobOffersList.filter(item => {
      if (item.Job.JobCategoryId == categoryId)
        this.joboffers.push(item);
    });


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
}
