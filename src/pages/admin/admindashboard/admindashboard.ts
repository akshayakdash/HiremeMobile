import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { DataContext } from '../../../providers/dataContext.service';
import { CommonServices } from '../../../providers/common.service';
import { EnLanguageServices } from '../../../providers/enlanguage.service';
import { FrLanguageServices } from '../../../providers/frlanguage.service';
@IonicPage()
@Component({
    selector: 'page-admindashboard',
    templateUrl: 'admindashboard.html',
})
export class AdmindashboardPage {
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('lineCanvas') lineCanvas;
    doughnutChart: any;
    lineChart: any;
    doughnutdata: any = [];
    linedata: any = [];
    tapOption = [];
    tabValue: string;
    year: string = "2018";
    loggedInUserDetails: any = {};
    colors = [
        "#2E8B57",
        "#f0ad4e",
        "#DEB887",
        "#A9A9A9",
        "#FAEBD7",
        "#DCDCDC",
        "#E9967A",
        "#F5DEB3",
        "#9ACD32",
        "#4272b7",
        "#0078ff",
        "#0003d2",
        "#4272b7",
        "#0065d0",
        "#c0d6e4",
        "#d001cf",
        "#d2d0d1",
        "#337465",
        "#0a4168",
        "#79e381",
        "#cedee9",
        "#149491",
        "#e8bbc0",
        "#cf3523",
        "#e12241",
        "#110055",
        "#899ec1",
        "#f2daf5",
        "#6a6a92"
    ];
    labelList:any = [];
    constructor(public navCtrl: NavController, public navParams: NavParams, public _dataContext: DataContext, 
        private commonService: CommonServices,private enLanguageServices:EnLanguageServices,
        private frLanguageServices:FrLanguageServices) {
      //  this.labelList = enLanguageServices.getLabelLists();
       

    }
    ionViewDidEnter() {
        this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLanguageSelected"))
        .then((result) => {
          if (result && result.language) {
            if (result.language == "en") {
              this.labelList = this.enLanguageServices.getLabelLists();
            } else {
              this.labelList = this.frLanguageServices.getLabelLists();
            }
            this.tapOption = [{ Value: this.labelList.label74, Key: "JobRequest" }, { Value: this.labelList.label75, Key: "JobOffer" }];
          }
        });
        this.tabValue = "JobRequest";
        this.getLoggedInUserDetailsFromCache();
    }
    getLoggedInUserDetailsFromCache() {
        this.commonService.getStoreDataFromCache(this.commonService.getCacheKeyUrl("getLoggedInUserDetails"))
            .then((result) => {
                if (result && result.userId) {
                    this.loggedInUserDetails = result;
                    this.getJobRequestCountsForAdmin();
                }
                else {
                    this.navCtrl.setRoot("LoginPage");
                }
            });
    }
    getJobOfferDoughnotDataForAdmin() {
        this._dataContext.GetJobOfferDoughnotDataForAdmin()
            .subscribe(response => {
                this.doughnutdata = response;
                this.setDoughnut();
            },
                error => {
                    this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
                });
    }
    getJobRequestDoughnotDataForAdmin() {
        this._dataContext.GetJobRequestDoughnotDataForAdmin()
            .subscribe(response => {
                this.doughnutdata = response;
                this.setDoughnut();
            },
                error => {
                    this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
                });
    }
    getJobOfferCountsForAdmin() {
        this._dataContext.GetJobOfferCountsForAdmin()
            .subscribe(response => {
                this.linedata = response;
                this.setLinechart();
                this.getJobOfferDoughnotDataForAdmin();
            },
                error => {
                    this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
                });
    }
    getJobRequestCountsForAdmin() {
        this._dataContext.GetJobRequestCountsForAdmin()
            .subscribe(response => {
                this.linedata = response;
                this.setLinechart();
                this.getJobRequestDoughnotDataForAdmin();

            },
                error => {
                    this.commonService.onMessageHandler(this.labelList.errormsg15, 0);
                });
    }

    setDoughnut() {
        let doughnutdatasets = [];
        let doughnutlabels = [];
        let doughnutcolors = [];

        this.doughnutdata.forEach((element, index) => {
            doughnutlabels.push(element.JobName);
            doughnutdatasets.push(element.TotalRequests);
            doughnutcolors.push(this.colors[index]);
        });

        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                labels: doughnutlabels,
                datasets: [{
                    label: 'No Of Members',
                    data: doughnutdatasets,
                    backgroundColor: doughnutcolors,
                    hoverBackgroundColor: doughnutcolors
                }]
            }
        });
    }
    setLinechart() {
        let linelabels = [];
        let linedatasets = [];

        this.linedata[0].Items.forEach(element => {
            linelabels.push(element.Month);
        });

        this.linedata.forEach((element, index) => {
            let constructor = 0;
            let lineitemdata = [];
            element.Items.forEach(element => {
                lineitemdata.push(element.TotalRequests);
            });
            linedatasets.push({
                label: element.JobName,
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: this.colors[index],
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: lineitemdata,
                spanGaps: false,
            })
        });
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: linelabels,
                datasets: linedatasets
            }

        });
    }
    //While Tab change
    tabSelection(event, option) {
        this.linedata = [];
        this.doughnutdata = [];
        if (option == 0) {
            this.tabValue = "JobRequest";
            this.getJobRequestCountsForAdmin();
        }
        else {
            this.tabValue = "JobOffer";
            this.getJobOfferCountsForAdmin();
        }
    }
}
