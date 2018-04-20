import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

declare var window;

@IonicPage()
@Component({
    selector: 'page-cv',
    templateUrl: 'cv.html',
})
export class CvPage {
    private imageUrl = "https://firebasestorage.googleapis.com/v0/b/findworkforyou-99999.appspot.com/o/images%2Fpic927869?alt=media&token=7b0773cc-671d-4e87-a9cb-c651622f2b29";
    letterObj = {
        to: '',
        from: '',
        text: ''
    };

    pdfObj = null;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private platform: Platform,
        private file: File,
        private fileOpener: FileOpener) {
    }
    createPdf() {
        this.makeFileIntoBlob(this.imageUrl, 'yourCv', 'image/png').then(blogImage => {
            var docDefinition = {
                content: [
                    { image: blogImage, style: 'image' },
                    { text: 'REMINDER', style: 'header' },
                    { text: new Date().toTimeString(), alignment: 'right' },

                    { text: 'From', style: 'subheader' },
                    { text: this.letterObj.from },

                    { text: 'To', style: 'subheader' },
                    this.letterObj.to,

                    { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },

                    {
                        ul: [
                            'Bacon',
                            'Rips',
                            'BBQ',
                        ]
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                    },
                    subheader: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 15, 0, 0]
                    },
                    story: {
                        italic: true,
                        alignment: 'center',
                        width: '50%',
                    },
                    image: {
                        width: '250 px',
                        height: '250 px',
                    }
                }
            }
            this.pdfObj = pdfMake.createPdf(docDefinition);
            // this.viewPdf();
        }).catch(error => {
            console.log(error);
        });
    }

    viewPdf() {
        this.pdfObj.open();
    }

    downloadPdf() {
        if (this.platform.is('cordova')) {
            this.pdfObj.getBuffer((buffer) => {
                var blob = new Blob([buffer], { type: 'application/pdf' });

                // Save the PDF to the data Directory of our App
                this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
                    // Open the PDf with the correct OS tools
                    this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
                })
            });
        } else {
            // On a browser simply use download!
            this.pdfObj.download();
        }
    }

    makeFileIntoBlob(_filePath, name, type) {
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(_filePath, (fileEntry) => {

                fileEntry.file((resFile) => {
                    let reader = new FileReader();
                    reader.onloadend = (evt: any) => {
                        let fileBlob: any = new Blob([evt.target.result], { type: type });
                        fileBlob.name = name;
                        resolve(fileBlob);
                    };

                    reader.onerror = (e) => {
                        alert('Failed file read: ' + e.toString());
                        reject(e);
                    };

                    reader.readAsArrayBuffer(resFile);
                });
            });
        });
    }

}
