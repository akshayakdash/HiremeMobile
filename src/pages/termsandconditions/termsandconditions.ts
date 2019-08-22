import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ActionSheetController, Events } from 'ionic-angular';
import { CommonServices } from '../../providers/common.service';
import { DataContext } from '../../providers/dataContext.service';

import { ChangeDetectorRef } from '@angular/core';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';

@IonicPage()
@Component({
  selector: 'page-termsandconditions',
  templateUrl: 'termsandconditions.html'
})
export class TermsAndConditionsPage {
  labelList:any = [];
    constructor(public events: Events,private cdr: ChangeDetectorRef, public actionSheetCtrl: ActionSheetController, 
      public navCtrl: NavController, public navParams: NavParams, public _dataContext: DataContext, 
      private commonService: CommonServices,
      private enLanguageServices:EnLanguageServices,
      private frLanguageServices:FrLanguageServices) {
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
      }
      gotoRegister() {
        this.navCtrl.pop();
      }
}