import { Component } from '@angular/core';
import { IonicPage, NavController, ActionSheetController } from 'ionic-angular';
import { User } from './../../models/user';

import { CameraOptions, Camera } from '@ionic-native/camera';
import { AngularFireDatabase } from 'angularfire2/database'

import firebase from 'firebase';

@IonicPage()
@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
})
export class RegisterPage{
    user: User;
    storage = firebase.storage().ref();
    constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController,
        public af: AngularFireDatabase, public camera: Camera) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RegisterPage');
        // console.log(this.user);
    }

    doRegister() {

    }

    chooseAvatar() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Chọn ảnh',
            buttons: [
                {
                    text: 'Chọn ảnh từ thư viện',
                    role: 'destructive',
                    handler: () => {
                        this.takePicture(0);
                    }
                },
                {
                    text: 'Chụp ảnh',
                    handler: () => {
                        this.takePicture(1);
                    }
                },
                {
                    text: 'Hủy',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        actionSheet.present();
    }

    takePicture(sourceType) {
        let options: CameraOptions = {
            quality: 100,
            sourceType: sourceType,
            destinationType: this.camera.DestinationType.DATA_URL,
            saveToPhotoAlbum: true,
            correctOrientation: true
        }

        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            const filename = Math.floor(Date.now() / 1000);
            const imageRef = this.storage.child(`images/${filename}.jpg`);
            imageRef.putString(base64Image, firebase.storage.StringFormat.DATA_URL).then((imageSnapshot) => {
                // Do something here when the data is succesfully uploaded!
                this.user.avatar_url = imageSnapshot.downloadURL;
            });
        }, (err) => {
            // Handle error
            console.log(err);
        });
    }



}
