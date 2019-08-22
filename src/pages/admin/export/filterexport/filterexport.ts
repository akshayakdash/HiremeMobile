import { Platform, NavParams, IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { DataContext } from '../../../../providers/dataContext.service';
import { CommonServices } from '../../../../providers/common.service';
import moment from 'moment';
import { EnLanguageServices } from '../../../../providers/enlanguage.service';
import { FrLanguageServices } from '../../../../providers/frlanguage.service';
@IonicPage()
@Component({
  selector: 'page-filterexport',
  templateUrl: 'filterexport.html'
})
export class FilterExportPage {
  character: any;
  age1: any;
  age2: any;
  age = [];

  exp1: any;
  exp2: any;
  experiences = [];



  cities = [
    { label: "Abidjan", value: "Abidjan" },
    { label: "Daloa", value: "Daloa" },
    { label: "Dabou", value: "Dabou" }
  ];
  selectedCity: any;

  district = [
    { label: "district1", value: "district1" },
    { label: "district2", value: "district2" },
    { label: "district3", value: "district3" }
  ];
  selectedDistrict: any;

  specificCrieteria = { "JobId": 1, "JobName": "Nanny", "JobCategoryId": 1, "JobGroup": "Internal Home Job", "JobDesc": null, "IconImage": "/assets/images/portfolio/nanny.jpg", "JobTasks": [{ "SubTasks": [], "JobTaskId": 1, "JobId": 1, "JobTaskName": "Cleaning", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/cleaning.png", "ParentJobTaskId": null, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [{ "SubTasks": [{ "SubTasks": [], "JobTaskId": 5, "JobId": 1, "JobTaskName": "Sauces", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/sauces.png", "ParentJobTaskId": 3, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 6, "JobId": 1, "JobTaskName": "Grilling", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/grill.png", "ParentJobTaskId": 3, "JobTaskCountryMapper": null, "Selected": false }], "JobTaskId": 3, "JobId": 1, "JobTaskName": "African Food", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/gratin.png", "ParentJobTaskId": 2, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [{ "SubTasks": [], "JobTaskId": 7, "JobId": 1, "JobTaskName": "Ovan", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/gratin.png", "ParentJobTaskId": 4, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 8, "JobId": 1, "JobTaskName": "Pastry", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/gratin.png", "ParentJobTaskId": 4, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 9, "JobId": 1, "JobTaskName": "Dessert", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/dessert.png", "ParentJobTaskId": 4, "JobTaskCountryMapper": null, "Selected": false }], "JobTaskId": 4, "JobId": 1, "JobTaskName": "European Food", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/gratin.png", "ParentJobTaskId": 2, "JobTaskCountryMapper": null, "Selected": false }], "JobTaskId": 2, "JobId": 1, "JobTaskName": "Cooking", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/cooking1.png", "ParentJobTaskId": null, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [{ "SubTasks": [], "JobTaskId": 5, "JobId": 1, "JobTaskName": "Sauces", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/sauces.png", "ParentJobTaskId": 3, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 6, "JobId": 1, "JobTaskName": "Grilling", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/grill.png", "ParentJobTaskId": 3, "JobTaskCountryMapper": null, "Selected": false }], "JobTaskId": 3, "JobId": 1, "JobTaskName": "African Food", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/gratin.png", "ParentJobTaskId": 2, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [{ "SubTasks": [], "JobTaskId": 7, "JobId": 1, "JobTaskName": "Ovan", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/gratin.png", "ParentJobTaskId": 4, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 8, "JobId": 1, "JobTaskName": "Pastry", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/gratin.png", "ParentJobTaskId": 4, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 9, "JobId": 1, "JobTaskName": "Dessert", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/dessert.png", "ParentJobTaskId": 4, "JobTaskCountryMapper": null, "Selected": false }], "JobTaskId": 4, "JobId": 1, "JobTaskName": "European Food", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/gratin.png", "ParentJobTaskId": 2, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 5, "JobId": 1, "JobTaskName": "Sauces", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/sauces.png", "ParentJobTaskId": 3, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 6, "JobId": 1, "JobTaskName": "Grilling", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/grill.png", "ParentJobTaskId": 3, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 7, "JobId": 1, "JobTaskName": "Ovan", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/gratin.png", "ParentJobTaskId": 4, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 8, "JobId": 1, "JobTaskName": "Pastry", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/gratin.png", "ParentJobTaskId": 4, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 9, "JobId": 1, "JobTaskName": "Dessert", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/dessert.png", "ParentJobTaskId": 4, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 12, "JobId": 1, "JobTaskName": "Child Care", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/childcare.png", "ParentJobTaskId": null, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 13, "JobId": 1, "JobTaskName": "Laundry", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/laundry.png", "ParentJobTaskId": null, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 14, "JobId": 1, "JobTaskName": "Cleaning", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/cleaning.png", "ParentJobTaskId": null, "JobTaskCountryMapper": null, "Selected": false }, { "SubTasks": [], "JobTaskId": 15, "JobId": 1, "JobTaskName": "Ironing", "JobTaskDescription": null, "TaskSectionName": null, "TaskGroupName": null, "TaskParamType": 1, "TaskParamValueType": 0, "ParamAvailableOptions": null, "IconImage": "/assets/images/ironing1.png", "ParentJobTaskId": null, "JobTaskCountryMapper": null, "Selected": false }] };

  jobs: any = [];
  searchParam = { MemberType: 0,Job:"" };
  labelList:any = [];
  members = [];
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
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
    this.getJobs();
    for (let i = 16; i < 51; i++) {
      this.age.push({ label: i.toString(), value: i });
    }
    for (let i = 1; i < 21; i++) {
      this.experiences.push({ label: i.toString(), value: i });
    }

    var characters = [
      {
        name: 'Gollum',
        quote: 'Sneaky little hobbitses!',
        image: 'assets/img/avatar-gollum.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'River Folk' },
          { title: 'Alter Ego', note: 'Smeagol' }
        ]
      },
      {
        name: 'Frodo',
        quote: 'Go back, Sam! I\'m going to Mordor alone!',
        image: 'assets/img/avatar-frodo.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Weapon', note: 'Sting' }
        ]
      },
      {
        name: 'Samwise Gamgee',
        quote: 'What we need is a few good taters.',
        image: 'assets/img/avatar-samwise.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Nickname', note: 'Sam' }
        ]
      }
    ];
    this.character = characters[this.params.get('charNum')];
  }
  getJobs() {
    this._dataContext.GetJobs()
      .subscribe(response => {
        this.jobs = response;
        console.log(this.jobs);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg12, 0);
        });
  }
  searchMembersForAdmin() {
    this._dataContext.SearchMembersForAdmin(this.searchParam)
      .subscribe(response => {
        this.members = response;
        console.log(this.members);
        this.members.forEach(element => {
          element.PublishedDate = moment(element.PublishedDate).format("DD MMM YYYY");
        });
        let Data = {Members:this.members,SearchParam:this.searchParam}
        this.viewCtrl.dismiss(Data);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
        });
  }
  dismiss() {
    this.viewCtrl.dismiss(false);
  }
}




