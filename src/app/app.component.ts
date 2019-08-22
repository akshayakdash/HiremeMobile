import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CommonServices } from '../providers/common.service';
import { EnLanguageServices } from '../providers/enlanguage.service';
import { FrLanguageServices } from '../providers/frlanguage.service';


@Component({
  templateUrl: 'app.html',
  providers: [StatusBar]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  language: any = "en";
  rootPage: any = "AppStartUp";
  pages: Array<{ title: string, component: any, imagepath: string }>;
  employeepages: Array<{ title: string, component: any, imagepath: string }>;
  employerpages: Array<{ title: string, component: any, imagepath: string }>;
  agencypages: Array<{ title: string, component: any, imagepath: string }>;
  adminpages: Array<{ title: string, component: any, imagepath: string }>;
  userDetails: any = {};
  labelList: any = [];
  languageSelected = "en";
  profileimg:string="";
  constructor(private commonService: CommonServices, public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public events: Events, private enLanguageServices: EnLanguageServices,
    private frLanguageServices: FrLanguageServices
  ) {

    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
      .then((result) => {
        if (result && result.language) {
          if (result.language == "en") {
            this.languageSelected = "en";
            this.labelList = enLanguageServices.getLabelLists();
            this.setmenu();
          } else {
            this.languageSelected = "fr";
            this.labelList = frLanguageServices.getLabelLists();
            this.setmenu();
          }

        }
        else {
          this.languageSelected = "fr";
          this.labelList = enLanguageServices.getLabelLists();
          this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getLanguageSelected"), { language: "fr",Accessed:false }).then(res => {
            //this.gotoDashboard();
            // this.events.publish('user1:languagechanged', "en", Date.now());
            this.setmenu();
          });
        }
      });



  }
setmenu(){
      // used for an example of ngFor and navigation
      this.employeepages = [
        { title: this.labelList.menu1, component: "DashboardPage", imagepath: "assets/imgs/menu/dashboard.png" },
        { title: this.labelList.menu2, component: "SearchjobsPage", imagepath: "assets/imgs/menu/search-job.png" },
        { title: this.labelList.menu3, component: "JobrequestsPage", imagepath: "assets/imgs/menu/my-job-requests.png" },
        { title: this.labelList.menu4, component: "FavoritejoboffersPage", imagepath: "assets/imgs/menu/favorites.png" },
        { title: this.labelList.menu5, component: "NotificationPage", imagepath: "assets/imgs/menu/messages-notifications.png" },
        { title: this.labelList.menu6, component: "ManagemysettingPage", imagepath: "assets/imgs/menu/manage-setting.png" }
      ];
      this.employerpages = [
        { title: this.labelList.menu1, component: "DashboardPage", imagepath: "assets/imgs/menu/dashboard.png" },
        { title: this.labelList.menu2, component: "SearchjobsPage", imagepath: "assets/imgs/menu/search-job.png" },
        { title: this.labelList.menu7, component: "EployerJobOffer", imagepath: "assets/imgs/menu/my-job-requests.png" },
        { title: this.labelList.menu4, component: "EmployerFavouriteJobRequest", imagepath: "assets/imgs/menu/favorites.png" },
        { title: this.labelList.menu5, component: "NotificationPage", imagepath: "assets/imgs/menu/messages-notifications.png" },
        { title: this.labelList.menu6, component: "ManagemysettingPage", imagepath: "assets/imgs/menu/manage-setting.png" }
      ];
      this.agencypages = [
        { title: this.labelList.menu1, component: "DashboardPage", imagepath: "assets/imgs/menu/dashboard.png" },
        { title: this.labelList.menu2, component: "SearchjobsPage", imagepath: "assets/imgs/menu/search-job.png" },
        { title: this.labelList.menu8, component: "AgencyregistercandidatePage", imagepath: "assets/imgs/menu/my-job-requests.png" },
        { title: this.labelList.menu9, component: "AgencyverifycandidatePage", imagepath: "assets/imgs/menu/check.png" },
        { title: this.labelList.menu3, component: "AgencymyjobrequestPage", imagepath: "assets/imgs/menu/my-job-requests.png" },
        { title: this.labelList.menu5, component: "NotificationPage", imagepath: "assets/imgs/menu/messages-notifications.png" },
        { title: this.labelList.menu6, component: "ManagemysettingPage", imagepath: "assets/imgs/menu/manage-setting.png" }
      ];
      this.adminpages = [
        { title: this.labelList.menu1, component: "AdmindashboardPage", imagepath: "assets/imgs/menu/dashboard.png" },
        { title: this.labelList.menu10, component: "VerifyagencyprofilePage", imagepath: "assets/imgs/menu/check.png" },
        { title: this.labelList.menu9, component: "VerifycandidateprofilePage", imagepath: "assets/imgs/menu/check.png" },
        { title: this.labelList.menu11, component: "VerifyemployerprofilePage", imagepath: "assets/imgs/menu/check.png" },
        { title: this.labelList.menu12, component: "VerifyjobrequestprofilePage", imagepath: "assets/imgs/menu/check.png" },
        { title: this.labelList.menu13, component: "VerifyjobofferprofilePage", imagepath: "assets/imgs/menu/check.png" },
        { title: this.labelList.menu14, component: "ExportPage", imagepath: "assets/imgs/menu/export.png" }
      ];
      this.events.publish('profilepic', this.userDetails.profile_pic_base64, Date.now());
      this.events.subscribe('profilepic', (img, time) => {
        this.profileimg = img;
      });
      this.events.subscribe('user:loginsuccessfully', (role, time) => {
        this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
          .then((result) => {
            this.userDetails = result;
            if (result && result.userId) {
              if (result.type == "Admin") {
                this.profileimg = "";
                this.pages = this.adminpages;
                // this.rootPage = "AdmindashboardPage";
              }
              else if (result.type == "Employee") {
                this.pages = this.employeepages;
                // this.rootPage = "DashboardPage";
              }
              else if (result.type == "Employer") {
                this.pages = this.employerpages;
                // this.rootPage = "DashboardPage";
              } else {
                this.pages = this.agencypages;
                // this.rootPage = "DashboardPage";
              }
              this.nav.setRoot("AppStartUp");
            }
            else {
              this.rootPage = "LoginPage";
            }
          });
      });
      this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
        .then((result) => {
          this.userDetails = result;
          if (result && result.userId) {
            if (result.type == "Admin") {
              this.pages = this.adminpages;
              // this.rootPage = "AdmindashboardPage";
            }
            else if (result.type == "Employee") {
              this.pages = this.employeepages;
              // this.rootPage = "DashboardPage";
            }
            else if (result.type == "Employer") {
              this.pages = this.employerpages;
              // this.rootPage = "DashboardPage";
            } else {
              this.pages = this.agencypages;
              // this.rootPage = "DashboardPage";
            }
            this.rootPage = "AppStartUp";
          }
          else {
            this.rootPage = "LoginPage";
          }
          this.initializeApp();
          //var selectFieldValue = document.querySelector("#google_translate_element select").value;
          //alert();
          // this.language = "en";//document.getElementById("language").value;
          // let selectField: any = document.querySelector("#google_translate_element select");
          // for (var i = 0; i < selectField.children.length; i++) {
          //   let option: any = selectField.children[i];
          //   // find desired langauge and change the former language of the hidden selection-field
          //   if (option.value == this.language) {
          //     selectField.selectedIndex = i;
          //     // trigger change event afterwards to make google-lib translate this side
          //     selectField.dispatchEvent(new Event('change'));
          //     break;
          //   }
          // }
        });
}
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString("#fe003f");
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  logout() {
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
    .then((result) => {
      if (result && result.language) {
        
        this.commonService.clearAllCache().then(res=>{
          this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getLanguageSelected"), { language: result.language,Accessed:result.Accessed }).then(res1=>{
            this.nav.setRoot("LoginPage");
           // this.setSlideInfo();
          })
          
        });
        
      }
    });
    //this.commonService.clearAllCache();
   

  }
  setSlideInfo(){
    this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getSliderAccessDetails"), {Accessed:true}).then(res => {
      //this.gotoDashboard();
      this.nav.setRoot("LoginPage");
    });
  }
  contactus(){
    this.nav.setRoot("ContactUsPage");
  }
  howitworks(){
    this.nav.setRoot("GuidesPage");
  }
  ChangeToFrench() {
    // this.language = "fr";//document.getElementById("language").value;
    // let selectField: any = document.querySelector("#google_translate_element select");
    // for (var i = 0; i < selectField.children.length; i++) {
    //   let option: any = selectField.children[i];
    //   // find desired langauge and change the former language of the hidden selection-field
    //   if (option.value == this.language) {
    //     selectField.selectedIndex = i;
    //     // trigger change event afterwards to make google-lib translate this side
    //     selectField.dispatchEvent(new Event('change'));
    //     break;
    //   }
    // }
  }
  ChangeToEnglish() {
    // this.language = "en";//document.getElementById("language").value;
    // let selectField: any = document.querySelector("#google_translate_element select");
    // for (var i = 0; i < selectField.children.length; i++) {
    //   let option: any = selectField.children[i];
    //   // find desired langauge and change the former language of the hidden selection-field
    //   if (option.value == this.language) {
    //     selectField.selectedIndex = i;
    //     // trigger change event afterwards to make google-lib translate this side
    //     selectField.dispatchEvent(new Event('change'));
    //     break;
    //   }
    // }
  }
  changeLanguage() {
    // this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getLanguageSelected"), {language:"en"}).then(res=>{
    //   //this.gotoDashboard();
    //   this.events.publish('user:languagechanged', "en", Date.now());
    //   });



    // if(this.languageSelected=="en"){
    //   this.languageSelected = "fr";
    //   this.labelList = this.frLanguageServices.getLabelLists();
    //   this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getLanguageSelected"), {language:"fr"}).then(res=>{
    //     //this.gotoDashboard();
    //     this.events.publish('user1:languagechanged', "fr", Date.now());
    //     });

    // }else{
    //   this.languageSelected = "en";
    //   this.labelList = this.enLanguageServices.getLabelLists();
    //   this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getLanguageSelected"), {language:"en"}).then(res=>{
    //     //this.gotoDashboard();
    //     this.events.publish('user1:languagechanged', "en", Date.now());
    //     });

    // }

    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
      .then((result) => {
        if (result && result.language) {
          if (result.language == "en") {
            this.languageSelected = "en";
            this.labelList = this.frLanguageServices.getLabelLists();
            this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getLanguageSelected"), { language: "fr" }).then(res => {
              //this.gotoDashboard();
              //this.events.publish('user1:languagechanged', "en", Date.now());
              window.location.reload();
            });
          } else {
            this.languageSelected = "fr";
            this.labelList = this.enLanguageServices.getLabelLists();
            this.commonService.setStoreDataIncache(this.commonService.getCacheKeyUrl("getLanguageSelected"), { language: "en" }).then(res => {
              //this.gotoDashboard();
              //this.events.publish('user1:languagechanged', "en", Date.now());
              window.location.reload();
            });
          }

        }
      });



  }
  getLoggedInUserDetails(): any {
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
      .then((result) => {
        this.userDetails = result;
        if (result && result.userId) {
          if (result.type == "Admin") {
            this.pages = this.adminpages;
            // this.rootPage = "AdmindashboardPage";
          }
          else if (result.type == "Employee") {
            this.pages = this.employeepages;
            // this.rootPage = "DashboardPage";
          }
          else if (result.type == "Employer") {
            this.pages = this.employerpages;
            // this.rootPage = "DashboardPage";
          } else {
            this.pages = this.agencypages;
            // this.rootPage = "DashboardPage";
          }
          this.rootPage = "AppStartUp";
          this.initializeApp();
        }
        else {
          this.rootPage = "LoginPage";
        }
      });
  }
}
