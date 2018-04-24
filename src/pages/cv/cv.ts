import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoaderService } from '../../services/loaderService';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@IonicPage()
@Component({
    selector: 'page-cv',
    templateUrl: 'cv.html',
})
export class CvPage {
    private user: any;
    showExperience = true;
    showEducation = true;
    showEnglish = true;
    showIt = true;

    private infoCV = {
        headerTarget: '',
        contentExp: { company: '', major: '', description: '' },
        contentEdu: { school: '', certificate: '', grade: '' },
        contentHobby: '',
        contentSkill: '',
        footerEnglish: {
            listen: 50,
            read: 50,
            write: 50,
            speak: 50
        },
        footerIt: {
            word: 50,
            excel: 50,
            powerpoint: 50,
            outlook: 50
        }
    };

    pdfObj = null;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private platform: Platform,
        private file: File,
        private fileOpener: FileOpener,
        private storage: Storage,
        private loaderService: LoaderService
    ) {
        this.storage.get('auth').then(user => {
            if (user) {
                this.user = user;
                this.user.gender = user.gender ? "Male" : "Female";
            }
        });
    }

    createCV() {
        this.user.avatar_url = 'https://www.gravatar.com/avatar/d50c83cc0c6523b4d3f6085295c953e0';
        this.loaderService.loaderNoSetTime('Creating cv ...');
        this.toDataURL(this.user.avatar_url, (dataUrl) => {

            var docDefinition = {
                content: [
                    {
                        style: 'header',
                        columns: [
                            {
                                image: dataUrl,
                                style: 'header-image',
                            },
                            {
                                text: 'TARGET \n' +
                                    this.infoCV.headerTarget + '\n' +
                                    this.user.description,
                                style: 'textColumn',
                            }
                        ]
                    },
                    '\n \n \n \n',
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                text: 'EXPERIENCE \n',
                                style: 'titleColumn'
                            },
                            {
                                text: 'INFORMATION \n',
                                style: 'titleColumn'
                            }
                        ]
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                text:
                                    'Company: ' + this.infoCV.contentExp.company + '\n' +
                                    'Major: ' + this.infoCV.contentExp.major + '\n' +
                                    'Description: ' + this.infoCV.contentExp.description,
                                style: 'textColumn'
                            },
                            {
                                text:
                                    'Name: ' + this.user.name + '\n' +
                                    'Gender: ' + this.user.gender + '\n' +
                                    'Email: ' + this.user.email + '\n' +
                                    'Age: ' + this.user.age + '\n' +
                                    'Address: ' + this.user.address.street + ' ,' + this.user.address.district + ' ,' + this.user.address.city,
                                style: 'textColumn'
                            }
                        ]
                    },
                    '\n \n',
                    {
                        columns: [
                            {
                                text: 'EDUCATION \n',
                                style: 'titleColumn'
                            },

                            {
                                text: 'HOBBY \n',
                                style: 'titleColumn'
                            }
                        ]
                    },
                    {
                        columns: [
                            {
                                text:
                                    'School: ' + this.infoCV.contentEdu.school + '\n' +
                                    'Certificate: ' + + this.infoCV.contentEdu.certificate + '\n' +
                                    'Grade: ' + this.infoCV.contentEdu.grade,
                                style: 'textColumn'
                            },
                            {
                                text: this.infoCV.contentHobby,
                                style: 'textColumn'
                            }
                        ]
                    },
                    {
                        columns: [
                            {

                            }, {
                                text: 'SKILL \n',
                                style: 'titleColumn'
                            }
                        ]
                    },
                    {
                        columns: [
                            {

                            }, {
                                text: this.infoCV.contentSkill,
                                style: 'textColumn'
                            }
                        ]
                    },
                    '\n \n',
                    {
                        columns: [
                            {
                                text: 'ENGLISH \n',
                                style: 'titleColumn'
                            },

                            {
                                text: 'IT \n',
                                style: 'titleColumn'
                            }
                        ]
                    },
                    {
                        columns: [
                            {
                                text:
                                    'Listent: ' + this.convertValueToGrade(this.infoCV.footerEnglish.listen) + '\n' +
                                    'Read: ' + this.convertValueToGrade(this.infoCV.footerEnglish.read) + '\n' +
                                    'Speak: ' + this.convertValueToGrade(this.infoCV.footerEnglish.speak) + '\n' +
                                    'Write: ' + this.convertValueToGrade(this.infoCV.footerEnglish.write) + '\n',
                                style: 'textColumn'
                            },
                            {
                                text:
                                    'Word: ' + this.convertValueToGrade(this.infoCV.footerIt.word) + '\n' +
                                    'Excel: ' + this.convertValueToGrade(this.infoCV.footerIt.excel) + '\n' +
                                    'Powerpoint: ' + this.convertValueToGrade(this.infoCV.footerIt.powerpoint) + '\n' +
                                    'Outlook: ' + this.convertValueToGrade(this.infoCV.footerIt.outlook) + '\n',
                                style: 'textColumn'
                            }
                        ]
                    }
                ],
                styles: {
                    header: {
                        bold: true,
                        color: 'purple'
                    },
                    image: {
                        width: '250 px',
                        height: '250 px',
                    },
                    textColumn: {
                        fontSize: 16,
                    },
                    titleColumn: {
                        fontSize: 20,
                        color: 'purple',
                    }
                }
            }
            this.pdfObj = pdfMake.createPdf(docDefinition);
            this.loaderService.dismisLoader().then(data => {
                this.pdfObj.open();
            }).catch(e => console.log(e));
        });
    }

    downloadCV() {
        if (this.platform.is('cordova')) {
            let nameCv = this.user.name + '_cv.pdf';
            this.pdfObj.getBuffer((buffer) => {
                var blob = new Blob([buffer], { type: 'application/pdf' });

                this.file.writeFile(this.file.dataDirectory, nameCv, blob, { replace: true }).then(fileEntry => {
                    this.fileOpener.open(this.file.dataDirectory + nameCv, 'application/pdf');
                });
            });
        } else {
            this.pdfObj.download();
        }
    }

    toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    toggleInfo(item) {
        this[item] = !this[item];
    }

    convertValueToGrade(val) {
        if (val < 25) {
            return 'D';
        }
        else if (val >= 25 && val < 50) {
            return 'B';
        }
        else if (val >= 50 && val < 75) {
            return 'C';
        } else {
            return 'A';
        }
    }
}
