import { Platform, NavParams, IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { CommonServices } from '../../providers/common.service';
import { DataContext } from '../../providers/dataContext.service';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})
export class FilterPage {

  specificCrieteria: any = {
    IsGenderActive: false,
    Gender: "",
    EnableProfileVerifiedFilter: false,
    ProfileVerified: "",
    EnableAgeFilter: false,
    MinAge: "",
    MaxAge: "",
    EnableExperienceFilter: false,
    MinYearsOfExperience: "",
    MaxYearsOfExperience: "",
    IsStaffTypeFilterActive: false,
    StaffType: "",
    EnableDisponibilityFilter: false,
    Disponibility: "",
    EnableLocalizationFilter: false,
    City: "",
    District: "",
    EnableSalaryFilter: false,
    MinSalary: "",
    MaxSalary: "",
    Job: 1,
    Tasks: ""
  };
  taskIds: any='';
  cities: any = [];
  districts: any = [];
  minAge: any = [];
  maxAge: any = [];
  experiences: any = [];
  activeTab: number = 0;
  jobTasks: any = [];
  title: any = "";
  labelList: any = [];
  constructor(
    public platform: Platform,
    public navParam: NavParams,
    public viewCtrl: ViewController,
    public _dataContext: DataContext,
    public navParams: NavParams,
    private commonService: CommonServices,
    private enLanguageServices: EnLanguageServices,
    private frLanguageServices: FrLanguageServices
  ) {
    //this.labelList = enLanguageServices.getLabelLists();
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
    this.specificCrieteria.Job = this.navParam.get("Job");
    this.title = this.navParam.get("JobName");
    this.getActiveJobTasks();
    this.getMinAge();
    this.getMaxAge();
    this.getexperiences();
    this.getActiveCities();
  }
  ionViewDidEnter() {
    this.activeTab = this.navParam.get("activeTab");
  }
  getexperiences() {
    this.experiences = [];
    for (var i = 1; i <= 20; i++) {
      this.experiences.push({ value: i, label: i });
    }
  }
  getMinAge() {
    this.minAge = [];
    for (var i = 16; i <= 50; i++) {
      this.minAge.push({ value: i, label: i });
    }
  }
  getMaxAge() {
    this.maxAge = [];
    for (var i = 16; i <= 50; i++) {
      this.maxAge.push({ value: i, label: i });
    }
  }
  getActiveCities() {
    this._dataContext.GetActiveCities(0)
      .subscribe(responnse => {
        if (responnse.length > 0) {
          this.cities = responnse;
          //this.getActiveDistricts();
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg4, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg4, 0);
        });
  }

  getActiveDistricts() {
    this._dataContext.GetActiveDistricts(this.cities[0].CityId)
      .subscribe(responnse => {
        if (responnse.length > 0) {
          this.districts = responnse;
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg5, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg5, 0);
        });
  }
  onToggleChange(value) {
    switch (value) {
      case "Gender":
        if (!this.specificCrieteria.IsGenderActive) {
          this.specificCrieteria.Gender = "";
        }
        break;
      case "ProfileVerified":
        if (!this.specificCrieteria.IsProfileVerifiedActive) {
          this.specificCrieteria.ProfileVerified = "";

        }
        break;
      case "StaffType":
        if (!this.specificCrieteria.IsStaffTypeFilterActive) {
          this.specificCrieteria.StaffType = "";
        }
        break;
      case "Date":
        if (!this.specificCrieteria.IsDisponibilityFilterActive) {
          this.specificCrieteria.Disponibility = "";
        }
        break;
      case "Age":
        if (!this.specificCrieteria.IsAgeFilterActive) {
          this.specificCrieteria.MinAge = "";
          this.specificCrieteria.MaxAge = "";
        }
        break;
      case "Experience":
        if (!this.specificCrieteria.IsExperienceFilterActive) {
          this.specificCrieteria.MinYearsOfExperience = "";
          this.specificCrieteria.MaxYearsOfExperience = "";
        }
        break;
      case "Localization":
        if (!this.specificCrieteria.IsLocalizationFilterActive) {
          this.specificCrieteria.City = "";
          this.specificCrieteria.District = "";
        }
        break;
      case "Salary":
        if (!this.specificCrieteria.IsSalaryFilterActive) {
          this.specificCrieteria.MinSalary = "";
          this.specificCrieteria.MaxSalary = "";
        }
        break;
      default:
        break;
    }
  }
  //validate only number
  onlyNumber(event) {
    return this.commonService.validateOnlyNumber(event);
  }
  closeModal() {
    this.viewCtrl.dismiss(false);
  }
  onSelectedCity() {
    this.getActiveDistricts();
  }
  onFilterSearch() {
    let url = "?Job=" + this.specificCrieteria.Job;
    for (var property in this.specificCrieteria) {
      if (this.specificCrieteria.hasOwnProperty(property)) {
        console.log(property, ' ', this.specificCrieteria[property]);
        if (property != "Job" && this.specificCrieteria[property] != "") {
          url = url + "&" + property + "=" + this.specificCrieteria[property];
        }
      }
    }
    this.taskIds = "";
    this.jobTasks.forEach(element => {
      if (element.Selected) {
        this.taskIds = this.taskIds + "&Tasks=" + element.JobTaskId;
        if (element.SubTasks.length > 0) {
          element.SubTasks.forEach(element1 => {
            if (element1.Selected) {
              this.taskIds = this.taskIds + "&Tasks=" + element1.JobTaskId;
              if (element1.SubTasks.length > 0) {
                element1.SubTasks.forEach(element2 => {
                  if (element2.Selected) {
                    this.taskIds = this.taskIds + "&Tasks=" + element2.JobTaskId;
                  }
                });
              }
            }
          });
        }
      }
    });
    url = url + this.taskIds;
    if (this.activeTab == 0) {
      this._dataContext.GetSearchPublishedJobRequest(url)
        .subscribe(response => {
          this.viewCtrl.dismiss(response);
        },
          error => {
            this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
          });
    }
    else {
      this._dataContext.GetSearchPublishedJobOffer(url)
        .subscribe(response => {
          this.viewCtrl.dismiss(response);
        },
          error => {
            this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
          });
    }

  }
  getActiveJobTasks() {
    this._dataContext.GetJobTasks(this.specificCrieteria.Job)
      .subscribe(response => {
        if (response.JobTasks.length > 0) {
          this.jobTasks = response.JobTasks;
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg16, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg16, 0);
        });
  }
}


import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'jobTaskPipe' })
export class JobTaskPipe1 implements PipeTransform {
  transform(elements: any[]) {
    return elements.filter(hero => !hero.ParentJobTaskId);
  }
}


