import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';
import { CommonServices } from '../../providers/common.service';
import { DataContext } from '../../providers/dataContext.service';
@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class ContactUsPage {
  labelList:any = [];
  lanuageSelected = "en"
  userDetails: any = {};
  loggedInUserDetails: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events,
    public _dataContext: DataContext,
    private commonService: CommonServices,
    private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices) {
     // this.labelList = enLanguageServices.getLabelLists();
  }

  ionViewDidLoad() {
    this.getLoggedInUserDetailsFromCache();
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
    .then((result) => {
      if (result && result.language) {
        if (result.language == "en") {
          this.lanuageSelected = "en";
          this.labelList = this.enLanguageServices.getLabelLists();
        } else {
          this.lanuageSelected = "fr";
          this.labelList = this.frLanguageServices.getLabelLists();
        }
        
      }
    });
    console.log('ionViewDidLoad DashboardPage');
  }
  getLoggedInUserDetailsFromCache() {

  }
}