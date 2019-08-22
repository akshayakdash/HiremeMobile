import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ActionSheetController, Events } from 'ionic-angular';
import { CommonServices } from '../../providers/common.service';
import { DataContext } from '../../providers/dataContext.service';
import * as $ from 'jquery';
import { Camera, CameraOptions } from '@ionic-native/camera';
import moment from 'moment';
import { File } from '@ionic-native/file';
import { ChangeDetectorRef } from '@angular/core';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [Camera, File]
})
export class RegisterPage {
  @ViewChild('registerSlider') slider: Slides;
  private captchaPassed: boolean = true;
  private captchaResponse: string;
  otpsent: boolean = false;
  pinId: any = "";
  pin: any = "";
  registerObj = new Register();
  cities: any = [];
  districts: any = [];
  countries: any = [];
  slideACtiveIndex: number = 0;
  securityQuestions: any = [];
  maxDate: string;
  emailValidated: boolean = false;
  images: any = [
    { id: 0, image: "", file: "", fileName: "" },
    { id: 1, image: "", file: "", fileName: "" },
    { id: 2, image: "", file: "", fileName: "" },
  ];
  labelList: any = [];
  constructor(private zone: NgZone, public events: Events, private cdr: ChangeDetectorRef, private file: File, public actionSheetCtrl: ActionSheetController, private camera: Camera, public navCtrl: NavController, public navParams: NavParams, public _dataContext: DataContext, private commonService: CommonServices,
    private enLanguageServices: EnLanguageServices,
    private frLanguageServices: FrLanguageServices) {
    this.registerObj.AgreeTermsAndConditions = false;
    // this.events.subscribe('user1:languagechanged', (language, time) => {
    //   if (language == "en") {
    //     this.labelList = enLanguageServices.getLabelLists();
    //   } else {
    //     this.labelList = frLanguageServices.getLabelLists();
    //   }
    // });
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
    this.maxDate = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    this.getCountries();
    console.log('ionViewDidLoad RegisterPage');
  }

  captchaResolved(response: string): void {
    this.zone.run(() => {
      this.captchresponse().then(response => {
        //if (response && response.Success) {
        this.captchaPassed = true;
        this.captchaResponse = response;
        this.cdr.detectChanges();
        // }else{
        //  // this.commonService.onMessageHandler(this.labelList.errormsg35, 0);
        // }
      })
    });
  }

  captchresponse(): Promise<any> {
    return $.ajax({
      type: 'GET',
      url: 'https://www.jobtek-ci.com/Account/ValidateCaptcha?gcaptchaResp=' + this.captchaResponse, // we are calling json method
      //dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        console.log(response);
        if (response.Success) {
          return response;
          // var cntryCode = $("#country_code").val();
          //var unmaskedPhoneNum = $("#ConfirmPhoneNumber").val().replace(/-/g, ''); 
          // var phoneNumWithCntryCode = cntryCode + unmaskedPhoneNum;
          // console.log("phoneNumWithCntryCode");
          // raise a request for PIN
          //requestForInfoBipPin(phoneNumWithCntryCode);
        } else {
          // this.commonService.onMessageHandler(this.labelList.errormsg35, 0);
          return null;
        }
      },
      error: function (ex) {

        return null;
      }
    });
  }

  sendotp() {
    this.zone.run(() => {
      var data = {
        applicationId: "C875EB281731D7407DC415D5D1CDA216",
        messageId: "3CFD4CFADFFC4DD6F8710B966C2C7768",
        from: "JobTek",
        to: "+225" + this.registerObj.PhoneNumber
      };
      this.otpResponse(data).then(response => {
        if (response && response.PinId) {
          this.otpsent = true;
          this.pinId = response.PinId;
          this.commonService.onMessageHandler(this.labelList.successmsg5, 1);
          this.cdr.detectChanges();
        } else {
          this.commonService.onMessageHandler(this.labelList.errormsg37, 0);
        }
      })
    });
  }

  otpResponse(data): Promise<any> {
    return $.ajax({
      //url: "https://gn9g6.api.infobip.com/2fa/1/pin",
      url:"/Account/RequestForInfoBipPin",
      method: "POST",
      //dataType: "json",
      crossDomain: true,
      contentType: "application/json",
      data: JSON.stringify(data),
      cache: false,
      //beforeSend: function (xhr) {
      //    /* Authorization header */
      //    xhr.setRequestHeader("Authorization", "Basic " + Utils.getUsernamePassword());
      //    xhr.setRequestHeader("X-Mobile", "false");
      //},
      //headers: { "Authorization": "App 75ba074d74c8443fb7477345b600f110-c1f7659a-4b43-4a34-ad2f-38e9bbef9a15" },
      headers: { "Authorization": "App a9b0579dba2904ea8256b687b1fc90c3-171ff64c-b4ec-460c-979d-f830a045ae71" },
      success: function (response) {
        console.log(response);
        console.log(response.PinId);
        return response;
        // this.slider.slideNext();
        // $("#info-bip-pinid").val(response.pinId);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        return null;
        //alert("Unable to request for pin. Please try after sometime.");
      }
    });
  }
  continuetoregister() {
    this.validateresponse().then(response => {
      if (response && response.Verified) {
        this.slider.slideNext();
        this.cdr.detectChanges();
      } else {
        this.commonService.onMessageHandler(this.labelList.errormsg36, 0);
      }
    })
  }
  validateresponse(): Promise<any> {
    let pin = this.pin;
    let pinId = this.pinId;
    return $.ajax({
      type: 'GET',
      url: 'https://www.jobtek-ci.com/Account/ValidateInfoBipPin?pinId=' + pinId + '&pin=' + pin, // we are calling json method
      //dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        console.log(response);
        if (response.Verified) {
          return response;
          //  $('.verify-tel-sec').hide();
          //   $('.gr-captcha-sec').hide();
          // $('.info-bip-sec').hide();
          // $('.doc-sec').show();

        } else {
          //this.commonService.onMessageHandler(this.labelList.errormsg36, 0);
          return null;
          //alert("Incorrect Pin");
        }
      },
      error: function (ex) {
        console.log(ex);


        return null;
      }
    });
  }
  resendotp() {

    if (this.pinId) {
      this.resendotprresponse(this.pinId).then(response => {
        if (response != null) {
          this.commonService.onMessageHandler(this.labelList.successmsg5, 1);
          this.pinId = response.PinId;
          this.cdr.detectChanges();
        }
      })
    } else {
      this.commonService.onMessageHandler(this.labelList.errormsg37, 0);
    }
  }
  resendotprresponse(pinid): Promise<any> {
    var infoBipDat = { pinId: pinid };
    return $.ajax({
     // url: "https://gn9g6.api.infobip.com/2fa/1/pin/" + pinid + "/resend",
      url: "/Account/ResendRequestForInfoBipPin",
      method: "POST",
      //dataType: "json",
      data: JSON.stringify(infoBipDat),
      crossDomain: true,
      contentType: "application/json",
      cache: false,
     // headers: { "Authorization": "App 75ba074d74c8443fb7477345b600f110-c1f7659a-4b43-4a34-ad2f-38e9bbef9a15" },
      headers: { "Authorization": "App a9b0579dba2904ea8256b687b1fc90c3-171ff64c-b4ec-460c-979d-f830a045ae71" },
      success: function (response) {
        console.log(response);
        console.log(response.PinId);
        //this.pinId = response.pinId;
        return response;
        //alert("Resend pin successfull.Please check your phone number and enter the code.");
      },
      error: function (jqXHR, textStatus, errorThrown) {

        return null;
      }
    });
  }
  cancel() {
    this.slider.slidePrev();
  }
  gotoDashboard() {
    this.navCtrl.setRoot("DashboardPage");
  }
  gotoLogin() {
    this.navCtrl.setRoot("LoginPage");
  }
  slideChanged() {
    this.slideACtiveIndex = this.slider.getActiveIndex();
  }
  register() {
    this.registerObj.SecurityQuestionAnswer = "Answer";
    if (this.validateFirstSlide() && this.validateSecondSlide()) {
      this.registerObj.ConfirmPhoneNumber = this.registerObj.PhoneNumber;
      this.registerObj.profile_pic_base64 = this.images[0].file.substr(this.images[0].file.indexOf(',') + 1, this.images[0].file.length);
      this.registerObj.id_proof_base64 = this.images[1].file.substr(this.images[1].file.indexOf(',') + 1, this.images[1].file.length);
      this.registerObj.id_proof_back_base64 = this.images[2].file.substr(this.images[2].file.indexOf(',') + 1, this.images[2].file.length);
      this._dataContext.RegisterUser(this.registerObj)
        .subscribe(response => {
          if(response.Status == "OK"){
            this.commonService.onMessageHandler(response.Message, 1);
            this.navCtrl.setRoot("LoginPage");
          }else{
            this.commonService.onMessageHandler(response.Message, 0);
          }
          
        },
          error => {
            this.commonService.onMessageHandler(this.labelList.errormsg2, 0);
          });
    }
  }
  checkemailidexist() {
    if (this.registerObj.Email == undefined || this.registerObj.Email == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg10, 0)
      this.emailValidated = false;
    } else {
      let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (this.registerObj.Email.match(mailformat)) {
        this._dataContext.CheckEmaiIdExist(this.registerObj.Email)
          .subscribe(response => {
            if(!response){
              this.emailValidated = true;
              //this.commonService.onMessageHandler(this.labelList.errormsg38, 0);
            }else{
              this.emailValidated = false;
              this.commonService.onMessageHandler("Email " + this.registerObj.Email + " "+ this.labelList.errormsg38, 0);
            }
            // this.commonService.onMessageHandler(this.labelList.successmsg1, 1);
            // this.navCtrl.setRoot("LoginPage");
          },
            error => {
             // this.commonService.onMessageHandler(this.labelList.errormsg2, 0);
            });
      }else{
        this.emailValidated = false;
        this.commonService.onMessageHandler(this.labelList.validmsg28, 0)
      }
    }

  }
  getCountries() {
    this._dataContext.getCountries()
      .subscribe(responnse => {
        if (responnse.length > 0) {
          this.countries = responnse;
          // this.getActiveDistricts();
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg3, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg3, 0);
        });
  }
  getActiveCities() {
    this._dataContext.GetActiveCities(this.registerObj.CountryId)
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

  getMyStyles() {
    
    let myStyles = {
      'margin-top': this.slideACtiveIndex == 1 ? '-230px' : this.slideACtiveIndex == 2 ? '-190px' : '0px'
    };
    return myStyles;
  }

  onSelectedCity() {
    this.getActiveDistricts();
  }
  //validate only number
  onlyNumber(event) {
    return this.commonService.validateOnlyNumber(event);
  }
  getActiveDistricts() {
    this.districts = [];
    this._dataContext.GetActiveDistricts(this.registerObj.CityId)
      .subscribe(responnse => {
        if (responnse.length > 0) {
          this.districts = responnse;
          this.getSecurityQuestions();
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg5, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg5, 0);
        });
  }
  continue() {
  //  if (this.validateFirstSlide()) {
      this.slider.slideNext();
      this.getSecurityQuestions();
   // }


  }
  validateFirstSlide(): boolean {

    if (this.registerObj.UserRoles == undefined || this.registerObj.UserRoles == "0") {
      this.commonService.onMessageHandler(this.labelList.validmsg1, 0)
      return false;
    } else if (this.registerObj.Gender == undefined || this.registerObj.Gender == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg2, 0)
      return false;
    } else if (this.registerObj.FirstName == undefined || this.registerObj.LastName == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg3, 0)
      return false;
    } else if (this.registerObj.LastName == undefined || this.registerObj.LastName == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg4, 0)
      return false;
    } else if (this.registerObj.DOB == undefined || this.registerObj.DOB == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg5, 0)
      return false;
    } else if (this.registerObj.CountryId == undefined || this.registerObj.CountryId == null) {
      this.commonService.onMessageHandler(this.labelList.validmsg6, 0)
      return false;
    } else if (this.registerObj.CityId == undefined || this.registerObj.CityId == null) {
      this.commonService.onMessageHandler(this.labelList.validmsg7, 0)
      return false;
    }
    //else if (this.registerObj.DistrictId == undefined || this.registerObj.DistrictId == null) {
    //this.commonService.onMessageHandler(this.labelList.validmsg8, 0)
    //return false;
    // // } else if (this.registerObj.Address == undefined || this.registerObj.Address == "") {
    // //   this.commonService.onMessageHandler(this.labelList.validmsg9, 0)
    // //   return false;
    //} 
    else if (this.registerObj.DOB == undefined || this.registerObj.DOB == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg5, 0)
      return false;
    } else if (this.registerObj.Email == undefined || this.registerObj.Email == undefined) {
      this.commonService.onMessageHandler(this.labelList.validmsg10, 0)
      return false;
    }
    else if (this.registerObj.CountryCode == undefined || this.registerObj.CountryCode == null) {
      this.commonService.onMessageHandler(this.labelList.validmsg11, 0)
      return false;
    }
    else if (this.registerObj.PhoneNumber == undefined || this.registerObj.PhoneNumber == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg12, 0)
      return false;
    }
    else {
      return true;
    }
  }
  validateSecondSlide() {
    if (this.registerObj.UserName == undefined || this.registerObj.UserName == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg13, 0)
      return false;
    } else if (this.registerObj.Password == undefined || this.registerObj.Password == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg14, 0)
      return false;
    } else if (this.registerObj.ConfirmPassword == undefined || this.registerObj.ConfirmPassword == "") {
      this.commonService.onMessageHandler(this.labelList.validmsg15, 0)
      return false;
    } else if (this.registerObj.ConfirmPassword != this.registerObj.Password) {
      this.commonService.onMessageHandler(this.labelList.validmsg16, 0)
      return false;
    } else if (!this.registerObj.AgreeTermsAndConditions) {
      this.commonService.onMessageHandler(this.labelList.validmsg27, 0)
      return false;
    }
    // else if (this.registerObj.SecurityQuestionId == undefined || this.registerObj.SecurityQuestionId == null) {
    //   this.commonService.onMessageHandler(this.labelList.validmsg17, 0)
    //   return false;
    // } else if (this.registerObj.SecurityQuestionAnswer == undefined || this.registerObj.SecurityQuestionAnswer == null) {
    //   this.commonService.onMessageHandler(this.labelList.validmsg18, 0)
    //   return false;
    // } 
    else {
      return true;
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
  getSecurityQuestions() {
    this._dataContext.GetSecurityQuestions()
      .subscribe(responnse => {
        if (responnse.length > 0) {
          this.securityQuestions = responnse;
        }
        else
          this.commonService.onMessageHandler(this.labelList.errormsg7, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg7, 0);
        });
  }
  gotoForgotPassword() {
    this.navCtrl.setRoot("ForgotpasswordPage");
  }
  opentandc() {
    this.navCtrl.push("TermsAndConditionsPage");
  }
}
class Register {
  Gender: string;
  FirstName: string;
  LastName: string;
  DOB: string;
  CountryId: number;
  CityId: number;
  DistrictId: number;
  Address: string;
  Email: string;
  CountryCode: any = "+225";
  PhoneNumber: string;
  profile_pic: any;
  id_proof: any;
  id_proof_back: any;
  UserRoles: string;
  UserName: string;
  Password: string;
  ConfirmPassword: string;
  SecurityQuestionId: number;
  SecurityQuestionAnswer: string;
  AgreeTermsAndConditions: boolean;
  profile_pic_base64: string;
  id_proof_base64: string;
  id_proof_back_base64: string;
  CompanyName: string;
  ResponsibleName: string;
  WebSiteUrl: string;
  CompanyActivity: string;
  ConfirmPhoneNumber: string;

}