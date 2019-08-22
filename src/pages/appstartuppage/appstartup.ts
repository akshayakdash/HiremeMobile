import { Component } from '@angular/core';
import { NavController, IonicPage, Events } from 'ionic-angular';
import { DataContext } from '../../providers/dataContext.service';
import { CommonServices } from '../../providers/common.service';

@IonicPage()
@Component({
    selector: 'page-appstartup',
    templateUrl: 'appstartup.html'
})
export class AppStartUp {

    loggedInUserDetails: any = {};
    constructor(public navCtrl: NavController,
        public events: Events,
        public _dataContext: DataContext,
        private commonService: CommonServices) {
    }

    ionViewDidEnter() {
        this.getLoggedInUserDetails();
    }
    getLoggedInUserDetails(): any {
        this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
            .then((result) => {
                let userDetails = result;
                if (result && result.userId) {
                    if (result.type == "Admin") {
                        this.navCtrl.setRoot("AdmindashboardPage");
                       // this.navCtrl.setRoot("GuidesPage");
                    }
                    else if (result.type == "Employee") {
                        //this.navCtrl.setRoot("DashboardPage");GuidesPage

                        //this.navCtrl.setRoot("GuidesPage");
                        this.checkSliderStatus();
                    }
                    else if (result.type == "Employer") {
                       // this.navCtrl.setRoot("DashboardPage");
                      // this.navCtrl.setRoot("GuidesPage");
                      this.checkSliderStatus();
                    } else {
                       // this.navCtrl.setRoot("DashboardPage");
                       //this.navCtrl.setRoot("GuidesPage");
                       this.checkSliderStatus();
                    }

                }
                else {
                    this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getLanguageSelected"), { language: "fr" }).then(res => {
                        //this.gotoDashboard();
                        // this.events.publish('user1:languagechanged', "en", Date.now());
                        this.navCtrl.setRoot("LoginPage");
                      });
                    
                }
            });
    }

    checkSliderStatus(){
        this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
            .then((result) => {
                if (result && result.Accessed != undefined) {
                    if (result.Accessed) {
                        this.navCtrl.setRoot("DashboardPage");
                    }else{
                        this.navCtrl.setRoot("GuidesPage");
                    }
                    
                }else{
                    this.navCtrl.setRoot("GuidesPage");
                }
            });
    }
}