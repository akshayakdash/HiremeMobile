import { Component, ChangeDetectorRef } from '@angular/core';
import { PopoverController, IonicPage, NavController, DateTime, NavParams, ActionSheetController } from 'ionic-angular';
import * as $ from 'jquery';
import moment from 'moment';
import { CommonServices } from '../../../providers/common.service';
import { DataContext } from '../../../providers/dataContext.service';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { EnLanguageServices } from '../../../providers/enlanguage.service';
import { FrLanguageServices } from '../../../providers/frlanguage.service';

@IonicPage()
@Component({
  selector: 'page-createagencyjobrequestform',
  templateUrl: 'createagencyjobrequestform.html',
  providers: [Camera, File]
})
export class CreateAgencyJobRequestForm {
  cities: any = [];
  districts: any = [];
  createJobRequest: any = {
    AgencyId:0,
    Id: 0,
    Title: "Title",
    CandidateId: 0,
    Gender: 2,
    JobId: 0,
    StaffType: 0,
    ExperienceInYears: "",
    ExperienceInMonths: "",
    CityId: 0,
    DistrictId: 0,
    SalaryType: 1,
    ExpectedMinSalary: "",
    ExpectedMaxSalary: "",
    CanRead: false,
    CanWrite: false,
    SleepOnSite: false,
    MaxGroupPeople: "",
    MinGroupPeople: "",
    Disponibility: "",
    JobTasks: [],
    AdditionalDescription: "",
    JobRequestSkillPic1Base64: "",
    JobRequestSkillPic2Base64: "",
    JobRequestSkillPic3Base64: ""
  };
  candidates: any = [];
  showSelectedDate: string;
  showCurrentDate: string;
  defaultDate: Date;
  minDate: string;
  maxDate: string;
  jobTasks: any = [];
  images: any = [
    { id: 0, image: "", file: "" },
    { id: 1, image: "", file: "" },
    { id: 2, image: "", file: "" },
  ];

  loggedInUserDetails: any = {};
  labelList:any = [];
  constructor(
    public navCtrl: NavController,
    public _dataContext: DataContext,
    private commonService: CommonServices,
    public formBuilder: FormBuilder,
    public navParam: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private cdr: ChangeDetectorRef, private file: File,private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices
  ) {
   // this.labelList = enLanguageServices.getLabelLists();
    // this.createJobRequest = new FormGroup({
    //   Gender: new FormControl(2),
    //   CityId: new FormControl(0),
    //   DistrictId: new FormControl(0),
    //   StaffType: new FormControl(0),
    //   CanWrite: new FormControl(false),
    //   CanRead: new FormControl(false),
    //   showSelectedDate: new FormControl(''),
    //   Submit: new FormControl(''),
    //   SleepOnSite: new FormControl(false),
    //   SalaryType: new FormControl(1),
    //   MaxGroupPeople: new FormControl('', Validators.required),
    //   MinGroupPeople: new FormControl('', Validators.required),
    //   ExpectedMinSalary: new FormControl('', Validators.required),
    //   ExpectedMaxSalary: new FormControl('', Validators.required),
    //   ExperienceInYears: new FormControl('', Validators.required),
    //   ExperienceInMonths: new FormControl('', Validators.required),
    //   JobTasks: new FormControl([]),
    //   jobTasks: new FormArray([
    //     new FormControl('')
    //   ]),

    //   // CityId: new FormControl(0, Validators.required),
    //   // DistrictId: new FormControl(0, Validators.required)
    // });
    this.createJobRequest.JobId = this.navParam.get("jobId");
    this.createJobRequest.CityId = 0;
    this.createJobRequest.DistrictId = 0;
    this.createJobRequest.Gender = 2;
    this.createJobRequest.StaffType = 0;
    this.createJobRequest.SalaryType = 1;
  }
  ionViewWillEnter() {
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
    this.showSelectedDate = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    this.minDate = "1900-12-31";
    this.maxDate = "2050-12-31";//moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  }

  //Get logged in user details from cache.
  getLoggedInUserDetailsFromCache() {
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
      .then((result) => {
        if (result && result.userId) {
          this.loggedInUserDetails = result;
          this.createJobRequest.AgencyId = this.loggedInUserDetails.userId;
          this.getMyCandidates();
          this.getActiveCities();
          this.getActiveJobTasks();

        }
        else {
          this.navCtrl.setRoot("LoginPage");
        }
      });
  }
  getMyCandidates() {
    this._dataContext.GetMyCandidatesForAgency(this.createJobRequest.AgencyId)
      .subscribe(response => {
        this.candidates = response;
        if (this.candidates && this.candidates.length > 0) {
          this.candidates.forEach(element => {
            element["Selected"] = false;
          });
        }
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
        });
  }
  getActiveJobTasks() {
    this._dataContext.GetJobTasks(this.createJobRequest.JobId)
      .subscribe(responnse => {
        if (responnse.JobTasks.length > 0) {
          this.jobTasks = responnse.JobTasks;
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg16, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg16, 0);
        });
  }
  getActiveCities() {
    this._dataContext.GetActiveCities(0)
      .subscribe(responnse => {
        if (responnse.length > 0) {
          this.cities = responnse;
          // this.getActiveDistricts();
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg4, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg4, 0);
        });
  }
  onSelectedCity() {
    this.getActiveDistricts();
  }
  getActiveDistricts() {
    this._dataContext.GetActiveDistricts(this.createJobRequest.CityId)
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
  //validate only number
  onlyNumber(event) {
    return this.commonService.validateOnlyNumber(event);
  }
  onSelectedDate() {
    this.createJobRequest.Disponibility = moment(this.showSelectedDate).format("DD-MMM-YYYY");
  }
  //Create Job Request
  onCreateJobRequest() {
    if (this.validateJobRequestForm()) {
      this.createJobRequest.JobTasks = this.jobTasks;
      // this.jobTasks.forEach(element => {
      //   if (element.Selected)
      //     this.createJobRequest.JobTasks.push({
      //       JobTaskId: element.JobTaskId,
      //       Selected: true,
      //       Note: "Sample task note"
      //     });
      // });
      let selectedCandidates = [];
      this.candidates.forEach(element => {
        if (element.Selected) {
          selectedCandidates.push(element.CandidateId);
        }
      });
      this.createJobRequest.CandidateIds = selectedCandidates;
      this.createJobRequest.Disponibility = moment(this.showSelectedDate).format("DD-MMM-YYYY");
      this.createJobRequest.JobRequestSkillPic1Base64 = this.images[0].file.substr(this.images[0].file.indexOf(',') + 1, this.images[0].file.length);
      this.createJobRequest.JobRequestSkillPic2Base64 = this.images[1].file.substr(this.images[1].file.indexOf(',') + 1, this.images[1].file.length);
      this.createJobRequest.JobRequestSkillPic3Base64 = this.images[2].file.substr(this.images[2].file.indexOf(',') + 1, this.images[2].file.length);
      this._dataContext.CreateNewJobRequestForAgency(this.createJobRequest)
        .subscribe(responnse => {
          if (responnse.Status == "OK") {
            this.commonService.onMessageHandler(responnse.Message, 1);
            this.createJobRequest = {};
            this.createJobRequest.CityId = 0;
            this.createJobRequest.DistrictId = 0;
            this.createJobRequest.Gender = 2;
            this.createJobRequest.StaffType = 0;
            this.createJobRequest.SalaryType = 1;
            this.navCtrl.setRoot("AgencymyjobrequestPage");
          }
          else
            this.commonService.onMessageHandler(this.labelList.errormsg32, 0);
        },
          error => {
            this.commonService.onMessageHandler(this.labelList.errormsg32, 0);
          });
    }
  }

  uploadImage(data) {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.labelList.label40,
      buttons: [
        {
          text: this.labelList.label41,
          icon: "ios-camera-outline",
          cssClass: 'icon-btn-color',
          handler: () => {
            this.chooseDocFromCamera(data);
          }
        },
        {
          text: this.labelList.label42,
          icon: "ios-image-outline",
          handler: () => {
            this.chooseFromGallery(data);
          }
        }
      ]
    });
    actionSheet.present();
  }
  chooseDocFromCamera(value) {
    var imageList: any = [];
    const cameraOptions: CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true,
      //targetWidth: 500,
      // targetHeight: 500
    }
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.readimage(imageData, value);
    });
    //this.uploadedDocument.push({ 'File': "data:image/png;base64,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", DocumentType: value == "report" ? this.report : this.prescription, 'FileName': "user.jpg", 'FileExtension': ".jpg", "Size": "30KB" });
  }
  //Get picture from Gallery
  chooseFromGallery(value) {
    const cameraOptions: CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true,
      // targetWidth: 1000,
      // targetHeight: 1000
    }
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.readimage(imageData, value);
    });
  }
  readimage(path, value) {
    (<any>window).resolveLocalFileSystemURL(path, (res) => {
      res.file((resFile) => {
        var reader = new FileReader();
        reader.readAsDataURL(resFile);
        reader.onloadend = (evt: any) => {
          if (resFile.type.indexOf("jpg") >= 0 || resFile.type.indexOf("jpeg") >= 0 || resFile.type.indexOf("png") >= 0) {
            this.images.forEach(element => {
              if (element.id == value.id) {
                element.file = reader.result;
              }
            });
            this.cdr.detectChanges();
          }
          else {
            this.commonService.onMessageHandler(this.labelList.errormsg6, 0);
          }
        }
      })
    })
  }
  validateJobRequestForm() {
    if (this.createJobRequest.Title == undefined || this.createJobRequest.Title == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg25, 0)
      return false;
    }
    else if (this.createJobRequest.ExperienceInYears == undefined || this.createJobRequest.ExperienceInYears == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg22, 0)
      return false;
    }
    // else if (this.createJobRequest.CityId == undefined || this.createJobRequest.CityId == "" || this.createJobRequest.CityId == 0) {
    //   this.commonService.onMessageHandler(this.labelList.validmsg7, 0)
    //   return false;
    // }
    // else if (this.createJobRequest.DistrictId == undefined || this.createJobRequest.DistrictId == "" || this.createJobRequest.DistrictId == 0) {
    //   this.commonService.onMessageHandler(this.labelList.validmsg8, 0)
    //   return false;
    // } 
    else if (this.createJobRequest.ExpectedMinSalary == undefined || this.createJobRequest.ExpectedMinSalary == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg19, 0)
      return false;
    } else if (this.createJobRequest.ExpectedMaxSalary == undefined || this.createJobRequest.ExpectedMaxSalary == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg20, 0)
      return false
    } else {
      return true;
    }
  }
}

