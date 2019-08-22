import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataContext } from '../../../providers/dataContext.service';
import { CommonServices } from '../../../providers/common.service';
import moment from 'moment';
import { ImageViewerController } from 'ionic-img-viewer';
import { EnLanguageServices } from '../../../providers/enlanguage.service';
import { FrLanguageServices } from '../../../providers/frlanguage.service';
@IonicPage()
@Component({
  selector: 'page-agencydetails',
  templateUrl: 'agencydetails.html',
})
export class AgencydetailsPage {
  _imageViewerCtrl: ImageViewerController;
  agencyId: any;
  agencyDetails: any = {};
  loggedInUserDetails:any={};
  labelList:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public _dataContext: DataContext, private commonService: CommonServices,
    private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices,
    imageViewerCtrl: ImageViewerController
  ) {
    this._imageViewerCtrl = imageViewerCtrl;
   // this.labelList = enLanguageServices.getLabelLists();
    this.agencyId = this.navParams.get("AgencyId");
   

  }
  getAgencyDetailsForAdmin() {
    this._dataContext.getAgencyDetails(this.agencyId)
      .subscribe(response => {
        this.agencyDetails = response;
        if (this.agencyDetails.CreatedDate != "" || this.agencyDetails.CreatedDate != null)
          this.agencyDetails.CreatedDate = moment(this.agencyDetails.CreatedDate).format("DD MMM YYYY");
          if (this.agencyDetails.ManagerDOB != "" || this.agencyDetails.ManagerDOB != null)
          this.agencyDetails.ManagerDOB = moment(this.agencyDetails.ManagerDOB).format("DD MMM YYYY");
        // this.agencyDetails.forEach(element => {
        //   element.PublishedDate = moment(element.PublishedDate).format("DD MMM YYYY");
        // });
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
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
                this.getAgencyDetailsForAdmin();
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
}
