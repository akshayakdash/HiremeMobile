import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import moment from 'moment';
import { Http, Response, Headers, RequestOptionsArgs } from '@angular/http';
import { DataContext } from '../../../providers/dataContext.service';
import { CommonServices } from '../../../providers/common.service';
import { EnLanguageServices } from '../../../providers/enlanguage.service';
import { FrLanguageServices } from '../../../providers/frlanguage.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@IonicPage()
@Component({
  selector: 'page-export',
  templateUrl: 'export.html',
  providers: [InAppBrowser]
})
export class ExportPage {
  members = [];
  searchParam = { MemberType: 0 };
  labelList:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private _http: Http,
    public _dataContext: DataContext, private commonService: CommonServices,private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices,private iab: InAppBrowser) {
   // this.labelList = enLanguageServices.getLabelLists();

    this.searchMembersForAdmin();
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
    console.log('ionViewDidLoad ExportPage');
  }
  searchMembersForAdmin() {


    this._dataContext.SearchMembersForAdmin(this.searchParam)
      .subscribe(response => {
        this.members = response;
        console.log(this.members);
        this.members.forEach(element => {
          element.PublishedDate = moment(element.PublishedDate).format("DD MMM YYYY");
        });
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg31, 0);
        });
  }
  openFilter() {
    let filterModal = this.modalCtrl.create("FilterExportPage");
    filterModal.onDidDismiss(item => {
      if (item) {
        this.members = item.Members;
        this.searchParam = item.SearchParam
      }
    })
    filterModal.present();
  }
  download() {

    let url = this.commonService.getApiServiceUrl()+ "api/Admin/ExportMembersToExcel?MemberType=" + this.searchParam.MemberType;
    for (var property in this.searchParam) {
      if (this.searchParam.hasOwnProperty(property)) {
        console.log(property, ' ', this.searchParam[property]);
        if (property != "MemberType" && this.searchParam[property] !="") {
          url = url + "&" + property + "=" + this.searchParam[property];
        }
      }
    }
   // alert(url);
    //window.open(url,"_system");
    const browser = this.iab.create(url,"_system");
    browser.on('loadstop').subscribe(event => {
      //browser.insertCSS({ code: "body{color: red;" });
   });
  }
}
