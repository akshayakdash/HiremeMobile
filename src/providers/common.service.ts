import { Injectable, ViewChild } from '@angular/core';
import { Events, ToastController, App, Navbar, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CacheService } from "ionic-cache";
import { FormControl } from '@angular/forms';
import * as $ from 'jquery';

@Injectable()
export class CommonServices {
  @ViewChild(Navbar) navBar: Navbar;
  HAS_LOGGED_IN = 'hasVisitRegisterPage';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  private apiServiceUrl: string;
  private _apiList: any = [];
  private appTtitle: string;
  private _cacheKeyList: any = [];
  private _appVersion: string;

  // ios flurry key
  // android flurry key
  constructor(
    public events: Events,
    public storage: Storage,
    public _toastCtrl: ToastController,
    public appCtrl: App,
    public alerCtrl: AlertController,
    private cache: CacheService,
  ) {
     // this.apiServiceUrl = "http://localhost:60114/"; //Local Api
   // this.apiServiceUrl = "https://jobtek.azurewebsites.net/";
    //this.apiServiceUrl = "http://40.89.160.98/";
	  this.apiServiceUrl = "https://www.jobtek-ci.com/";
    this.appTtitle = "";
    this._appVersion = "1.0.6";

    //Cache Key URL. This is used to maintain all cach  e data using cache key url.
    this._cacheKeyList["getCities"] = this.apiServiceUrl + "cities";
    this._cacheKeyList["getLoggedInUserDetails"] = this.apiServiceUrl + "userLoggedInStatus";
    this._cacheKeyList["getLanguageSelected"] = this.apiServiceUrl + "languageSelected";
    this._cacheKeyList["getSliderAccessDetails"] = this.apiServiceUrl + "sliderAccessStatus";
    //These API are used to get response from Elastic serach.
    this._apiList["getActiveCategories"] = { controller: "JobTekApi", method: "GetJobCategories", api: "api/JobTekApi/GetJobCategories" };
    this._apiList["getPublishedJobRequestByJobId"] = { controller: "JobRequests", method: "JobRequestDetails", api: "api/JobRequests" };
    this._apiList["getPublishedJobResponseByJobId"] = { controller: "JobOffers", method: "SearchJobOffers", api: "api/JobOffers" };
    this._apiList["makeJobOfferAsFavourite"] = { controller: " Candidates", method: "Create", api: "api/Candidates" };
    this._apiList["deleteFavourite"] = { controller: " Candidates", method: "DeleteFavouriteJobOffer", api: "api/Candidates" };
    this._apiList["getNotification"] = { controller: " Candidates", method: "Notifications", api: "api/Candidates" };
    this._apiList["getMyFavouriteOffers"] = { controller: "Candidates", method: "MyFavouriteJobOffers", api: "api/Candidates" };
    this._apiList["createNewJobRequest"] = { controller: "Candidates", method: "CreateJobRequest", api: "api/Candidates" };
    this._apiList["createNewJobResponse"] = { controller: "Candidates", method: "CreateJobResponse", api: "api/Candidates" };
    this._apiList["createNewJobResponse"] = { controller: "Employers", method: "CreateJobOffer", api: "api/Employers" };
    this._apiList["getJobTasks"] = { controller: "JobTekApi", method: "GetJobTasks", api: "api/JobTekApi/GetJobTasks" };
    this._apiList["getMySavedJobRequest"] = { controller: "Candidates", method: "MyJobRequests", api: "api/Candidates" };
    this._apiList["getActiveCities"] = { controller: "JobTekApi", method: "GetCities", api: "api/JobTekApi/GetCities" };
    this._apiList["getActiveDistricts"] = { controller: "JobTekApi", method: "GetDistricts", api: "api/JobTekApi/GetDistricts" };
    this._apiList["deleteJobRequest"] = { controller: "Candidates", method: "DeleteJobRequest", api: "api/Candidates" };
    this._apiList["getProfileDetails"] = { controller: " Candidates", method: "MyProfile", api: "api/Candidates" };
    this._apiList["getCountries"] = { controller: " JobTekApi", method: "GetCountries", api: "api/JobTekApi" };
    this._apiList["getCities"] = { controller: " JobTekApi", method: "GetCities", api: "api/JobTekApi" };
    this._apiList["getDistricts"] = { controller: " JobTekApi", method: "GetDistricts", api: "api/JobTekApi" };
    this._apiList["updateCandidateProfile"] = { controller: " Candidates", method: "MyProfile", api: "api/Candidates" };

    ///////////////////////////////Agency////////////////////////////
    this._apiList["getMyCandidates"] = { controller: " Agencies", method: "MyCandidates", api: "api/Agencies" };
    this._apiList["getMyJobRequestsForAgency"] = { controller: " Agencies", method: "MyJobRequests", api: "api/Agencies" };
    this._apiList["createNewJobRequestForAgency"] = { controller: "Agencies", method: "CreateJobRequest", api: "api/Agencies" };

    /////////////////////////////////////////////////////////////////

    ///////////////////////////////Admin////////////////////////////
    this._apiList["getJobOfferCountsForAdmin"] = { controller: " jobtekapi", method: "GetJobOfferCounts", api: "api/jobtekapi" };
    this._apiList["getJobOfferDoughnotDataForAdmin"] = { controller: " jobtekapi", method: "GetJobOfferDoughnotData", api: "api/jobtekapi" };
    this._apiList["getJobRequestCountsForAdmin"] = { controller: " jobtekapi", method: "GetJobRequestCounts", api: "api/jobtekapi" };
    this._apiList["getJobRequestDoughnotDataForAdmin"] = { controller: " jobtekapi", method: "GetJobRequestDoughnotData", api: "api/jobtekapi" };

    this._apiList["getUnverifiedAgenciesForAdmin"] = { controller: " Admin", method: "UnverifiedAgencies", api: "api/Admin" };
    this._apiList["activateAgency"] = { controller: "Admin", method: "ActivateAgency", api: "api/Admin" };
    this._apiList["getUnverifiedJobRequestsForAdmin"] = { controller: "Admin", method: "UnverifiedJobRequests", api: "api/Admin" };
    this._apiList["validateJobRequest"] = { controller: "Admin", method: "ValidateJobRequest", api: "api/Admin" };
    this._apiList["getUnverifiedJobOffersForAdmin"] = { controller: "Admin", method: "UnverifiedJobOffers", api: "api/Admin" };
    this._apiList["validateJobOffer"] = { controller: "Admin", method: "ValidateJobOffer", api: "api/Admin" };
    this._apiList["getUnVerifiedEmployersForAdmin"] = { controller: "Admin", method: "UnVerifiedEmployers", api: "api/Admin" };
    this._apiList["activateEmployer"] = { controller: "Admin", method: "ActivateEmployer", api: "api/Admin" };
    this._apiList["getUnverifiedCandidatesForAdmin"] = { controller: "Admin", method: "UnverifiedCandidates", api: "api/Admin" };
    this._apiList["activateCandidate"] = { controller: "Admin", method: "ActivateCandidate", api: "api/Admin" };
    this._apiList["searchMembersForAdmin"] = { controller: "Admin", method: "SearchMembers", api: "api/Admin" };
    this._apiList["exportMembersToExcelForAdmin"] = { controller: "Admin", method: "ExportMembersToExcel", api: "api/Admin" };
    this._apiList["getJobOfferDescriptionById"] = { controller: "JobOffers", method: "JobOfferDetails", api: "api/JobOffers" };
    this._apiList["getJobs"] = { controller: " jobtekapi", method: "GetJobs", api: "api/jobtekapi" };
    this._apiList["getSearchPublishedJobRequest"] = { controller: "JobRequests", method: "SearchJobRequests", api: "api/JobRequests" };
    this._apiList["getSearchPublishedJobResponse"] = { controller: "JobOffers", method: "SearchJobOffers", api: "api/JobOffers" };
    this._apiList["getSecurityQuestions"] = { controller: "Accounts", method: "SecurityQuestions", api: "api/Accounts/SecurityQuestions" };



    /////////////////////////////////////////////////////////////////
    this._apiList["loginUser"] = { controller: "Accounts", method: "Login", api: "api/Accounts" };
    this._apiList["registerUser"] = { controller: "Accounts", method: "Register", api: "api/Accounts/Register" };
    this._apiList["registerCandidateByAgency"] = { controller: "Agencies", method: "RegisterCandidate", api: "api/Agencies" };
    //////////////////////////////// Employer API Services ////////////////////////////////
    this._apiList["getMyFavJobRequestForEmployer"] = { controller: "Employers", method: "MyFavouriteJobRequests", api: "api/Employers" };
    this._apiList["getMyJobOfferForEmployee"] = { controller: "Employers", method: "MyJobOffers", api: "api/Employers" };
    this._apiList["deleteFavouriteJobRequestForEmployee"] = { controller: "Employers", method: "DeleteFavouriteJobRequest", api: "api/Employers" };
    this._apiList["deleteEmployerJobOffer"] = { controller: "Employers", method: "DeleteFavouriteJobRequest", api: "api/Employers" };
    this._apiList["getEmployerProfileDetails"] = { controller: "Employers", method: "MyProfile", api: "api/Employers" };
    this._apiList["getEmployerNotificationDetails"] = { controller: "Employers", method: "Notifications", api: "api/Employers" };
    this._apiList["getNoteForEmployer"] = { controller: "Employers", method: "GetJobRequestNotes", api: "api/Employers" };
    this._apiList["saveNotesforJobRequest"] = { controller: "Employers", method: "SaveJobRequestNote", api: "api/Employers" };
    this._apiList["getAgencyNotificationDetails"] = { controller: "Agencies", method: "Notifications", api: "api/Agencies" };
    this._apiList["getAgencyProfileDetails"] = { controller: "Agencies", method: "MyProfile", api: "api/Agencies" };
    this._apiList["getAgencyDetails"] = { controller: "jobtekapi", method: "GetAgencyDetails", api: "api/jobtekapi" };

    this._apiList["updateEmployerProfile"] = { controller: " Employers", method: "MyProfile", api: "api/Employers" };
    this._apiList["updateAgencyProfile"] = { controller: " Agencies", method: "MyProfile", api: "api/Agencies" };

    this._apiList["updateAgencyProfilePic"] = { controller: " Agencies", method: "UpdateProfilePic", api: "api/Agencies" };
    this._apiList["updateCanditateProfilePic"] = { controller: " Candidates", method: "UpdateProfilePic", api: "api/Candidates" };
    this._apiList["updateEmployeeProfilePic"] = { controller: " Employers", method: "UpdateProfilePic", api: "api/Employers" };

    this._apiList["updateAgencyIdPic"] = { controller: " Agencies", method: "UpdateIdCard", api: "api/Agencies" };
    this._apiList["updateCandidateIdPic"] = { controller: " Candidates", method: "UpdateIdCard", api: "api/Candidates" };
    this._apiList["updateEmployeeIdPic"] = { controller: " Employers", method: "UpdateIdCard", api: "api/Employers" };
    this._apiList["resetPassword"] = { controller: " Accounts", method: "PasswordReset", api: "api/Accounts" };
    this._apiList["forgotPassword"] = { controller: " Accounts", method: "ForgotPassword", api: "api/Accounts" };

    this._apiList["updateEmployeePassword"] = { controller: " Candidates", method: "ChangePassword", api: "api/Candidates" };
    this._apiList["updateEmployerPassword"] = { controller: " Employers", method: "ChangePassword", api: "api/Employers" };
    this._apiList["updateAgencyPassword"] = { controller: " Agencies", method: "ChangePassword", api: "api/Agencies" };
    this._apiList["deleteJobRequestForAdmin"] = { controller: " Agencies", method: "JobRequests", api: "api/Agencies" };
    this._apiList["activateCadidateForAgency"] = { controller: " Agencies", method: "Candidates", api: "api/Agencies" };
    this._apiList["makeJobRequestAsFavourite"] = { controller: " Employers", method: "AddFavouriteJobRequest", api: "api/Employers" };
    
  }
  //Clear all cache
  clearAllCache() {
    return this.cache.clearAll();
  }
  splitCountryCode(number) {
    return number.substring(0, number.length - 10);
  }
  splitMobileNumber(number) {
    return number.substring(number.length - 10, number.length);
  }
  getCacheKeyUrl(value) {
    return this._cacheKeyList[value];
  }
  getApiServiceUrl() {
    return this.apiServiceUrl;
  }
  getApiControllerName(value) {
    return this._apiList[value].api;
  }

  getTermsAndConditions() {
    // return this.termsAnsConditions;
  }
  validateEmail(email) {
    let email_reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email_reg.test(email);
  };
  validatePhone(phone) {
    let phone_reg = /^\d{10}$/
    return phone_reg.test(phone);
  }
  getWebsiteURL() {
    //return this.websiteURL;
  }
  validateAlphanumeric(e) {
    var regex = /^[a-zA-Z0-9]+$/;
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      return true;
    }
    e.preventDefault();
    return false;
  }
  validateOnlyNumber(event) {
    if (event.which == 8 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46)
      return true;

    else if ((event.which != 46 || $(this).val().toString().indexOf('.') != -1) && (event.which < 48 || event.which > 57))
      event.preventDefault();
  }
  isNumber(value) {
    let number_regx = /^\d+$/;
    return number_regx.test(value);
  }
  validatePassword(value) {
    //let passwordRegx = /^(?=([^\d]*\d){8})$/;
    return value.length >= 8 ? true : false;
  }
  validateOnlyNumbeAndText(evt, value) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (evt.which != 8 && evt.which != 0 && (evt.keyCode >= 48 && evt.keyCode <= 57) && (evt.keyCode >= 96 && evt.keyCode <= 105)) {
      return false;
    }
    if (this.isNumber(value)) {
      return true;
    }
    else {
      return false;
    }
  }

  convert_case(str) {
    return str.toLowerCase().replace(/\b./g, function (a) { return a.toUpperCase(); });
  }
  alertConfirmation(message, option) {
    let method = this.alerCtrl.create({
      title: "Please Confirm!",
      message: message,
      cssClass: 'alert-header-back-style',
      buttons: [
        {
          text: 'CANCEL',
          cssClass: 'cancel-btn-style',
          handler: () => {
            return false;
          }
        },
        {
          text: option,
          cssClass: 'ok-btn-style',
          handler: () => {
            return true;
          }
        }
      ]
    });
    method.present();
    method.onDidDismiss((data) => {
      return data;
    });
  }
  setStoreDataIncache(url, data) {
    let cacheKey = url;
    let uniqueKey = "job-tek-app";
    let ttl = 60 * 60 * 24 * 7 * 30 * 12;
    //      let delayType="all";
    return this.cache.saveItem(cacheKey, data, uniqueKey, ttl);
  }
  getStoreDataFromCache(key) {
    return this.cache.getItem(key).catch((data) => {
      // fall here if item is expired or doesn't exist
      return false;
    }).then((data) => {
      return data;
    });
  }
  convertBase64ToBanary(dataURI) {
    let BASE64_MARKER = ';base64,';
    let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    let base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }
  onMessageHandler(error_message, value) {
    let toast = this._toastCtrl.create({
      message: error_message,
      duration: 2000,
      cssClass: !value ? "error" : "success",
      showCloseButton: false
    });
    toast.present();
  }
}
