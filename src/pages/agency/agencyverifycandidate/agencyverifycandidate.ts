import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import { CommonServices } from '../../../providers/common.service';
import { DataContext } from '../../../providers/dataContext.service';
import { ImageViewerController } from 'ionic-img-viewer';
import { EnLanguageServices } from '../../../providers/enlanguage.service';
import { FrLanguageServices } from '../../../providers/frlanguage.service';
@IonicPage()
@Component({
  selector: 'page-agencyverifycandidate',
  templateUrl: 'agencyverifycandidate.html',
})
export class AgencyverifycandidatePage {

  _imageViewerCtrl: ImageViewerController;
  public candidates: Array<any> = [];
  userDetails:any={};
  labelList:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public _dataContext: DataContext, private commonService: CommonServices,imageViewerCtrl: ImageViewerController,
    private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices,
    public alertCtrl: AlertController
  ) {
    //this.labelList = enLanguageServices.getLabelLists();
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
    //this.loggedInUserDetails = JSON.parse(localStorage.getItem("loggedInUserCredential"));;
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
      .then((result) => {
        if (result && result.userId) {
          this.userDetails = result;
          this.getMyCandidates();
        }
        else {
          this.navCtrl.setRoot("LoginPage");
        }
      });
  }
  //   getActiveCategories() {
  //     this._dataContext.GetActiveCategories()
  //       .subscribe(response => {
  //         if (response.length > 0) {
  //           this.categories = response;
  //           this.selectedCategory = this.categories[0];
  //           this.filterDataBySelectedCategory(this.categories[0].JobCategoryId);
  //         }
  //         else
  //           this.commonService.onMessageHandler("No category found.", 0);
  //       },
  //         error => {
  //           this.commonService.onMessageHandler("Failed to retrieve categories. Please try again", 0);
  //         });
  //   }
  //   public filterDataBySelectedCategory(categoryId: number): void {
  //     // Handle what to do when a category is selected
  //     let pageNo = categoryId - 1;
  //     this.slides.slideTo(pageNo, 500);
  //     // this.categories.filter(item => {
  //     //   if (item.JobCategoryId == categoryId)
  //     //     this.selectedJobByCategoryId = item.Jobs;
  //     // });
  // this.getMyCandidates();

  //   }
  getMyCandidates() {
    this._dataContext.GetMyCandidatesForAgency(this.userDetails.userId)
      .subscribe(response => {
        console.log(response);
        this.candidates = response;
        // if (response.length > 0) {
        //   this.categories = response;
        //   this.selectedCategory = this.categories[0];

        // }
        // else
        //   this.commonService.onMessageHandler("No category found.", 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
        });
  }
  // // Method executed when the slides are changed
  // public slideChanged(): void {
  //   let currentIndex = this.slides.getActiveIndex();
  //   // this.showLeftButton = currentIndex !== 0;
  //   // this.showRightButton = currentIndex !== Math.ceil(this.slides.length() / 3);
  // }

  // // Method that shows the next slide
  // public slideNext(): void {
  //   this.slides.slideNext();
  // }

  // // Method that shows the previous slide
  // public slidePrev(): void {
  //   this.slides.slidePrev();
  // }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AgencyverifycandidatePage');
  }
  presentImage(myImage) {
  
    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();
 
    // setTimeout(() => imageViewer.dismiss(), 1000);
    // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }

  verify(item) {
    const confirm = this.alertCtrl.create({
      title: this.labelList.label99,
      message: this.labelList.label100,
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
            this.activateCandidate(item);
          }
        }
      ]
    });
    confirm.present();
  }
  activateCandidate(item) {
    this._dataContext.ActivateCandidateForAgency(item.CandidateId,this.userDetails.userId)
      .subscribe(response => {
        if (response.Status == "OK") {
          this.commonService.onMessageHandler(response.Message, 1);
          this.getMyCandidates();
        }
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg27, 0);
        });
  }
}
