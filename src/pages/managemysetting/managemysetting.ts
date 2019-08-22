import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { DataContext } from '../../providers/dataContext.service';
import { CommonServices } from '../../providers/common.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import moment from 'moment';
import { File } from '@ionic-native/file';
import { ChangeDetectorRef } from '@angular/core';
import { EnLanguageServices } from '../../providers/enlanguage.service';
import { FrLanguageServices } from '../../providers/frlanguage.service';
/**
 * Generated class for the ManagemysettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-managemysetting',
  templateUrl: 'managemysetting.html',
  providers: [Camera, File]
})
export class ManagemysettingPage {
  _imageViewerCtrl: ImageViewerController;

  userDetails: any = {ContactOption:[]};
  countries: any = [];
  cities = [];
  districts = [];
  selectedCity = "";
  selectedDistrict = "";
  selectedCountry: string = "";
  uploadPic = { Profile_pic_base64: "" };
  uploadIdPic = { Id_Card_Front_base64: "", Id_Card_Back_base64: "" };
  isEmailSelected = false;
  isPhoneSelected = false;
  loggedInUserDetails: any = {};
  labelList:any = [];
  constructor(private cdr: ChangeDetectorRef, private file: File, public actionSheetCtrl: ActionSheetController, private camera: Camera, public navCtrl: NavController, public _dataContext: DataContext, public navParams: NavParams, imageViewerCtrl: ImageViewerController,
    private commonService: CommonServices,
    private enLanguageServices:EnLanguageServices,
    private frLanguageServices:FrLanguageServices) {
    this._imageViewerCtrl = imageViewerCtrl;
    //const imageViewer = this._imageViewerCtrl.create(myImage);
  //  this.labelList = enLanguageServices.getLabelLists();
    this.getLoggedInUserDetailsFromCache();
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
    console.log('ionViewDidLoad ManagemysettingPage');
  }
  getLoggedInUserDetailsFromCache() {
    //this.loggedInUserDetails = JSON.parse(localStorage.getItem("loggedInUserCredential"));;
    this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
      .then((result) => {
        if (result && result.userId) {
          this.loggedInUserDetails = result;
          this.getProfileDetails();
        }
        else {
          this.navCtrl.setRoot("LoginPage");
        }
      });
  }
  presentImage(myImage) {

    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();

    // setTimeout(() => imageViewer.dismiss(), 1000);
    // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }
  changepassword() {
    this.navCtrl.push("ChangepasswordPage");
  }


  getProfileDetails() {


    if (this.loggedInUserDetails.type == "Employee") {
      this.getEmployeeProfile();
    } else if (this.loggedInUserDetails.type == "Employer") {
      this.getEmployerProfile();
    } else if (this.loggedInUserDetails.type == "Agency") {
      this.getAgencyProfile();
    }




  }
  getEmployeeProfile() {
    this._dataContext.CandidateProfileById(this.loggedInUserDetails.userId)
      .subscribe(response => {
        this.userDetails = response;
        console.log(this.userDetails);

        for (let i = 0; i < this.userDetails.ContactOption.length; i++) {

          switch (this.userDetails.ContactOption[i]) {
            case "Email":
              this.isEmailSelected = true;
              break;
            case "Phone":
              this.isPhoneSelected = true;
              break;
          }

        }




        if (this.userDetails.CountryId != undefined && this.userDetails.CountryId != "") {
          this.selectedCountry = this.userDetails.CountryId;
        }
        this.selectedCity = this.userDetails.CityId;
        this.selectedDistrict = this.userDetails.DistrictId;
        this.getCountriesDetails();
        this.getCitiesDetails();
        this.getDistrictDetails();

        // if (response.length > 0) {
        //   // this.notificationList = response;
        //   // this.notificationList.forEach(element => {
        //   //   element.CreatedDate = moment(element.CreatedDate).format("DD-MMM-YYYY");
        //   //});
        // }
        // else
        //   this.commonService.onMessageHandler("No notification found.", 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg22, 0);
        });
  }

  getEmployerProfile() {
    this._dataContext.GetEmployerProfileDetails(this.loggedInUserDetails.userId)
      .subscribe(response => {
        this.userDetails = response;
        console.log(this.userDetails);

        for (let i = 0; i < this.userDetails.ContactOption.length; i++) {

          switch (this.userDetails.ContactOption[i]) {
            case "Email":
              this.isEmailSelected = true;
              break;
            case "Phone":
              this.isPhoneSelected = true;
              break;
          }

        }




        if (this.userDetails.CountryId != undefined && this.userDetails.CountryId != "") {
          this.selectedCountry = this.userDetails.CountryId;
        }
        this.selectedCity = this.userDetails.CityId;
        this.selectedDistrict = this.userDetails.DistrictId;
        this.getCountriesDetails();
        this.getCitiesDetails();
        this.getDistrictDetails();

        // if (response.length > 0) {
        //   // this.notificationList = response;
        //   // this.notificationList.forEach(element => {
        //   //   element.CreatedDate = moment(element.CreatedDate).format("DD-MMM-YYYY");
        //   //});
        // }
        // else
        //   this.commonService.onMessageHandler("No notification found.", 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg22, 0);
        });
  }

  getAgencyProfile() {
    this._dataContext.GetAgencyProfileDetails(this.loggedInUserDetails.userId)
      .subscribe(response => {
        this.userDetails = response;
        console.log(this.userDetails);

        for (let i = 0; i < this.userDetails.ContactOption.length; i++) {

          switch (this.userDetails.ContactOption[i]) {
            case "Email":
              this.isEmailSelected = true;
              break;
            case "Phone":
              this.isPhoneSelected = true;
              break;
          }

        }




        if (this.userDetails.CountryId != undefined && this.userDetails.CountryId != "") {
          this.selectedCountry = this.userDetails.CountryId;
        }
        this.selectedCity = this.userDetails.CityId;
        this.selectedDistrict = this.userDetails.DistrictId;
        this.getCountriesDetails();
        this.getCitiesDetails();
        this.getDistrictDetails();

        // if (response.length > 0) {
        //   // this.notificationList = response;
        //   // this.notificationList.forEach(element => {
        //   //   element.CreatedDate = moment(element.CreatedDate).format("DD-MMM-YYYY");
        //   //});
        // }
        // else
        //   this.commonService.onMessageHandler("No notification found.", 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg22, 0);
        });
  }
  getCountriesDetails() {
    this._dataContext.getCountries()
      .subscribe(response => {
        this.countries = response;
        console.log(this.countries);

        // if (response.length > 0) {
        //   // this.notificationList = response;
        //   // this.notificationList.forEach(element => {
        //   //   element.CreatedDate = moment(element.CreatedDate).format("DD-MMM-YYYY");
        //   //});
        // }
        // else
        //   this.commonService.onMessageHandler("No notification found.", 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg3, 0);
        });
  }

  getCitiesDetails() {
    this._dataContext.getCities(this.selectedCountry)
      .subscribe(response => {
        this.cities = response;
        console.log(this.cities);

        // if (response.length > 0) {
        //   // this.notificationList = response;
        //   // this.notificationList.forEach(element => {
        //   //   element.CreatedDate = moment(element.CreatedDate).format("DD-MMM-YYYY");
        //   //});
        // }
        // else
        //   this.commonService.onMessageHandler("No notification found.", 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg4, 0);
        });
  }
  getDistrictDetails() {
    this._dataContext.getDistricts(this.selectedCity)
      .subscribe(response => {
        this.districts = response;
        console.log("-------");
        console.log(this.districts);
        // if (response.length > 0) {
        //   // this.notificationList = response;
        //   // this.notificationList.forEach(element => {
        //   //   element.CreatedDate = moment(element.CreatedDate).format("DD-MMM-YYYY");
        //   //});
        // }
        // else
        //   this.commonService.onMessageHandler("No notification found.", 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg5, 0);
        });
  }

  onChangeOfCountries() {
    this.userDetails.CountryId = this.selectedCountry;
  }
  onChangeOfCity() {
    this.userDetails.CityId = this.selectedCity;
  }
  onChangeOfDistrict() {
    this.userDetails.DistrictId = this.selectedDistrict;
  }


  updateProfile() {
    if (this.loggedInUserDetails.type == "Employee") {
      this.updateEmployeeProfile();
    } else if (this.loggedInUserDetails.type == "Employer") {
      this.updateEmployerProfile();
    } else if (this.loggedInUserDetails.type == "Agency") {
      this.updateAgencyProfile();
    }


  }


  updateEmployeeProfile() {
    this.userDetails.ContactOption = [];
    if (this.isEmailSelected) {
      this.userDetails.ContactOption.push("Email");
    }
    if (this.isPhoneSelected) {
      this.userDetails.ContactOption.push("Phone");
    }



    this._dataContext.updateProfile(this.loggedInUserDetails.userId, this.userDetails)
      .subscribe(response => {

        if (response.Status == "OK") {
          this.commonService.onMessageHandler(response.Message, 1);
          this.getProfileDetails();
        } else {
          this.commonService.onMessageHandler(response.Message, 1);
        }
        // if (response.length > 0) {
        //   // this.notificationList = response;
        //   // this.notificationList.forEach(element => {
        //   //   element.CreatedDate = moment(element.CreatedDate).format("DD-MMM-YYYY");
        //   //});
        // }
        // else
        //   this.commonService.onMessageHandler("No notification found.", 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg23, 0);
        });
  }

  updateEmployerProfile() {
    this.userDetails.ContactOption = [];
    if (this.isEmailSelected) {
      this.userDetails.ContactOption.push("Email");
    }
    if (this.isPhoneSelected) {
      this.userDetails.ContactOption.push("Phone");
    }



    this._dataContext.updateEmployerProfile(this.loggedInUserDetails.userId, this.userDetails)
      .subscribe(response => {

        if (response.Status == "OK") {
          this.commonService.onMessageHandler(response.Message, 1);
          this.getProfileDetails();
        } else {
          this.commonService.onMessageHandler(response.Message, 1);
        }
        // if (response.length > 0) {
        //   // this.notificationList = response;
        //   // this.notificationList.forEach(element => {
        //   //   element.CreatedDate = moment(element.CreatedDate).format("DD-MMM-YYYY");
        //   //});
        // }
        // else
        //   this.commonService.onMessageHandler("No notification found.", 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg23, 0);
        });
  }

  updateAgencyProfile() {
    this.userDetails.ContactOption = [];
    if (this.isEmailSelected) {
      this.userDetails.ContactOption.push("Email");
    }
    if (this.isPhoneSelected) {
      this.userDetails.ContactOption.push("Phone");
    }



    this._dataContext.updateAgencyProfile(this.loggedInUserDetails.userId, this.userDetails)
      .subscribe(response => {

        if (response.Status == "OK") {
          this.commonService.onMessageHandler(response.Message, 1);
          this.getProfileDetails();
        } else {
          this.commonService.onMessageHandler(response.Message, 1);
        }
        // if (response.length > 0) {
        //   // this.notificationList = response;
        //   // this.notificationList.forEach(element => {
        //   //   element.CreatedDate = moment(element.CreatedDate).format("DD-MMM-YYYY");
        //   //});
        // }
        // else
        //   this.commonService.onMessageHandler("No notification found.", 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg23, 0);
        });
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
            if (value == 0) {
              this.userDetails.profile_pic = reader.result;
              this.uploadPic.Profile_pic_base64 = reader.result;
              this.uploadPic.Profile_pic_base64 = this.uploadPic.Profile_pic_base64.substr(this.uploadPic.Profile_pic_base64.indexOf(',') + 1, this.uploadPic.Profile_pic_base64.length);
              this.uploadProfilePic();
            }
            else if (value == 1) {
              this.userDetails.id_proof = reader.result;
              this.uploadIdPic.Id_Card_Front_base64 = reader.result;
              this.uploadIdPic.Id_Card_Front_base64 = this.uploadIdPic.Id_Card_Front_base64.substr(this.uploadIdPic.Id_Card_Front_base64.indexOf(',') + 1, this.uploadIdPic.Id_Card_Front_base64.length);
              this.uploadIdProofPic();
            }
            else if (value == 2) {
              this.userDetails.id_proof1 = reader.result;
              this.uploadIdPic.Id_Card_Back_base64 = reader.result;
              this.uploadIdPic.Id_Card_Back_base64 = this.uploadIdPic.Id_Card_Back_base64.substr(this.uploadIdPic.Id_Card_Back_base64.indexOf(',') + 1, this.uploadIdPic.Id_Card_Back_base64.length);
              this.uploadIdProofPic();
            }
            this.cdr.detectChanges();
          }
          else {
            this.commonService.onMessageHandler(this.labelList.errormsg6, 0);
          }
        }
      })
    })
  }
  uploadProfilePic() {
    this._dataContext.UpdateProfilePicUpload(this.loggedInUserDetails.userId, this.uploadPic, this.loggedInUserDetails.type)
      .subscribe(response => {
        if (response.Status == "OK"){
          this.commonService.onMessageHandler(response.Message, 1);
          this.getProfileDetails();
        }
          
        else
          this.commonService.onMessageHandler(response.Message, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg24, 0);
        });
  }
  uploadIdProofPic() {
    this._dataContext.UpdateIdPicUpload(this.loggedInUserDetails.userId, this.uploadIdPic, this.loggedInUserDetails.type)
      .subscribe(response => {
        if (response.Status == "OK"){
           this.commonService.onMessageHandler(response.Message, 1);
          this.getProfileDetails();
        }
         
        else
          this.commonService.onMessageHandler(response.Message, 0);
      },
        error => {
          this.commonService.onMessageHandler(this.labelList.errormsg25, 0);
        });
  }
}
