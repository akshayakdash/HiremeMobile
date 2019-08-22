import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';
import { CommonServices } from '../../providers/common.service';
import { DataContext } from '../../providers/dataContext.service';
@IonicPage()
@Component({
  selector: 'page-guides',
  templateUrl: 'guides.html',
})
export class GuidesPage {
    constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events,
        public _dataContext: DataContext,
        private commonService: CommonServices,
        private enLanguageServices:EnLanguageServices,
        private frLanguageServices:FrLanguageServices) {
         // this.labelList = enLanguageServices.getLabelLists();
      }
    
      ionViewDidLoad() {

      }
      gotoDashboard(){
        // this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getSliderAccessDetails"), {Accessed:true}).then(res => {
        //     //this.gotoDashboard();
        //     this.navCtrl.setRoot("DashboardPage");
        //   });
          this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
          .then((result) => {
            if (result && result.language) {
              
            
                this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getLanguageSelected"), { language: result.language,Accessed:true }).then(res1=>{
                  
                  this.navCtrl.setRoot("DashboardPage");
                })
                
              
              
            }
          });
      }
    }