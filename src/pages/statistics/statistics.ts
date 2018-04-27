import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Storage } from '@ionic/storage';

import { UserProvider } from '../../providers/user/user';
import { PostProvider } from '../../providers/post/post';

@IonicPage()
@Component({
    selector: 'page-statistics',
    templateUrl: 'statistics.html',
})
export class StatisticsPage {

    @ViewChild('barCanvas') barCanVas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('lineCanvas') lineCanvas;
    barChart: any;
    doughnutChart: any;
    lineChart: any;
    dataChartUser = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    dataChartPost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    dataChartPostUser = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    private months = ["Jan", "Fer", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private userProvider: UserProvider,
        private postProvider: PostProvider,
        private storage: Storage
    ) {
        this.userProvider.getAll().subscribe(data => {
            let count = 0;
            data.forEach(user => {
                let month = new Date(user.createdAt).getMonth();
                this.dataChartUser[month]++;
                count++;
                if (count === data.length) {
                    this.initChartUser();
                }
            });
        });

        this.storage.get('auth').then(user => {
            let uid = user.uid;
            this.postProvider.getAll().subscribe(data => {
                let count = 0;
                data.forEach(post => {
                    let month = new Date(post.createdAt).getMonth();
                    if (post.userId == uid) {
                        this.dataChartPostUser[month]++;
                    }
                    this.dataChartPost[month]++;
                    count++;
                    if (count == data.length) {
                        this.initChartPost();
                        this.initChartUserPost();
                    }
                });
            });
        })
    }

    initChartUser() {
        this.barChart = new Chart(this.barCanVas.nativeElement, {
            type: 'bar',
            data: {
                labels: this.months,
                datasets: [{
                    label: '# of number User',
                    data: this.dataChartUser,
                    backgroundColor: [
                        'rgb(255, 99, 132, 0.94)',
                        'rgba(54, 162, 235, 0.94)',
                        'rgba(255, 206, 86, 0.94)',
                        'rgba(213, 93, 93, 0.94)',
                        'rgba(187, 213, 93, 0.94)',
                        'rgba(93, 213, 117, 0.94)',
                        'rgba(93, 211, 213, 0.94)',
                        'rgba(93, 121, 213, 0.94)',
                        'rgba(162, 87, 219, 0.94)',
                        'rgba(173, 151, 190, 0.94)',
                        'rgba(245, 97, 151, 0.94)',
                        'rgba(245, 237, 97, 0.94)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(213, 93, 93, 1)',
                        'rgba(187, 213, 93, 1)',
                        'rgba(93, 213, 117, 1)',
                        'rgba(93, 211, 213, 1)',
                        'rgba(93, 121, 213, 1)',
                        'rgba(162, 87, 219, 1)',
                        'rgba(173, 151, 190, 1)',
                        'rgba(245, 97, 151, 1)',
                        'rgba(245, 237, 97, 1)'
                    ],
                    boderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    initChartPost() {
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

            type: 'doughnut',
            data: {
                labels: this.months,
                datasets: [{
                    label: '# of Post',
                    data: this.dataChartPost,
                    backgroundColor: [
                        'rgb(255, 99, 132, 0.94)',
                        'rgba(54, 162, 235, 0.94)',
                        'rgba(255, 206, 86, 0.94)',
                        'rgba(213, 93, 93, 0.94)',
                        'rgba(187, 213, 93, 0.94)',
                        'rgba(93, 213, 117, 0.94)',
                        'rgba(93, 211, 213, 0.94)',
                        'rgba(93, 121, 213, 0.94)',
                        'rgba(162, 87, 219, 0.94)',
                        'rgba(173, 151, 190, 0.94)',
                        'rgba(245, 97, 151, 0.94)',
                        'rgba(245, 237, 97, 0.94)'
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#d55d5d",
                        "#bbd55d",
                        "#5dd575",
                        "#5dd3d5",
                        "#5d79d5",
                        "#a257db",
                        "#ad97be",
                        "#f56197",
                        "#f5ed61"
                    ]
                }]
            }

        });
    }

    initChartUserPost() {
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: this.months,
                datasets: [
                    {
                        label: "# Your were post",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
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
                        data: this.dataChartPostUser,
                        spanGaps: false,
                    }
                ]
            }
        });
    }
}
