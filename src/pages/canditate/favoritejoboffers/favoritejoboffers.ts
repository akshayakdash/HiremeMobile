import { Component, ViewChild, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController, ModalController } from 'ionic-angular';
import { DataContext } from '../../../providers/dataContext.service';
import { CommonServices } from '../../../providers/common.service';
import { EnLanguageServices } from '../../../providers/enlanguage.service';
import { FrLanguageServices } from '../../../providers/frlanguage.service';
/**
 * Generated class for the FavoritejoboffersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favoritejoboffers',
  templateUrl: 'favoritejoboffers.html',
})
export class FavoritejoboffersPage {

  @ViewChild(Slides) slides: Slides;
  public selectedCategory: any;
  public categories: Array<any>;
  public showLeftButton: boolean;
  public showRightButton: boolean;
  tabValue: number;
  isAvailable: boolean = true;
  publishedJobResult: any = [];
  myFavListByCategoryId: any = {};
  allMyFavouriteList: any = [];
  loggedInUserDetails: any = {};
  labelList:any = [];
  constructor(
    public injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams,
    public _dataContext: DataContext,
    public modalCtrl: ModalController,
    private commonService: CommonServices,public alerCtrl: AlertController,private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices) {
      //this.labelList = enLanguageServices.getLabelLists();
    this.publishedJobResult = [];
    this.tabValue = 0;
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
          this.getMyFavOffers();
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
    this.myFavListByCategoryId = [];
    let pageNo = categoryId - 1;
    this.slides.slideTo(pageNo, 500);
    this.allMyFavouriteList.filter(item => {
      if (item.Job.JobCategoryId == categoryId)
        this.myFavListByCategoryId.push(item);
    });
    if(this.myFavListByCategoryId.length == 0)
    this.isAvailable =false;
  }
  getMyFavOffers() {
    this._dataContext.GetMyFavouriteOffers(this.loggedInUserDetails.userId)
      .subscribe(response => {
        if (response.length > 0) {
          this.isAvailable = true;
          this.allMyFavouriteList = response;
          this.filterDataBySelectedCategory(this.categories[0].JobCategoryId);
        }
        else {
          this.myFavListByCategoryId = [];
          this.isAvailable = false;
          this.commonService.onMessageHandler(this.labelList.errormsg17, 0);
        }
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg19, 0);
        });
  }
  deleteFavouriteJobOffer(id, index) {
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
            this._dataContext.DeleteFavourite(this.loggedInUserDetails.userId, id)
            .subscribe(response => {
              this.myFavListByCategoryId.splice(index, 1);
              this.getActiveCategories();
              this.commonService.onMessageHandler(this.labelList.successmsg3, 1);
            },
              error => {
                this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
              });
          }
        }
      ]
    });
    method.present();
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
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad JobrequestsPage');
  // }
openNote(){
  let filterModal = this.modalCtrl.create("JobOfferNotePage");
    filterModal.onDidDismiss(item => {
      if (item) {
        //this.members = item.Members;
       // this.searchParam = item.SearchParam
      }
    })
    filterModal.present();
}
selectedFavDetails(JobOfferId){
  this.navCtrl.push("JobOfferDetails", { jobOfferId: JobOfferId });
 }
}
