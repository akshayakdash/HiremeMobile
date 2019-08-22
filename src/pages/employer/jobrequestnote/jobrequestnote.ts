import { Platform, NavParams, IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { DataContext } from '../../../providers/dataContext.service';
import { CommonServices } from '../../../providers/common.service';
import moment from 'moment';
import { EnLanguageServices } from '../../../providers/enlanguage.service';
import { FrLanguageServices } from '../../../providers/frlanguage.service';
@IonicPage()
@Component({
  selector: 'page-jobrequestnote',
  templateUrl: 'jobrequestnote.html'
})
export class JobRequestNotePage {
  requestInfo:any = {};
  userId:any = "";
  showType:string = "list_section"
  craeteNoteObj = new CreateNote();
  noteLists:Array<any> = [];
  labelList:any = [];
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public _dataContext: DataContext, private commonService: CommonServices,
    private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices
  ) {
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
    this.showType = "list_section";
    this.requestInfo = this.navParams.get('info');
    this.userId = this.navParams.get('userId');
   // this.labelList = enLanguageServices.getLabelLists();
    this.getNoteList();
  }
  getNoteList(){

    this._dataContext.GetNotesforJobRequest(this.userId,this.requestInfo.JobRequestId)
    .subscribe(response => {
      if (response.length > 0) {
        this.noteLists = response;
      }
      else
        this.commonService.onMessageHandler(this.labelList.errormsg17, 0);
    },
      error => {
        this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
      });
  }
  
  dismiss() {
    this.viewCtrl.dismiss(false);
    
  }
  createNote(){
      this.showType = "create_section";
  }
  cancelCreate(){
    this.showType = "list_section";
  }
  saveNote(){
   
    this._dataContext.SaveNotesforJobRequest(this.craeteNoteObj,this.userId,this.requestInfo.JobRequestId)
    .subscribe(response => {
     
        this.commonService.onMessageHandler(response, 1);
        this.showType = "list_section";
        this.getNoteList();
    },
      error => {
        this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
      });
  }
}
class CreateNote{
  StarRating:number;
  Note:string = "";
}




