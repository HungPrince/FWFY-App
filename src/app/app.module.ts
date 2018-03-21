import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms'
import { IonicStorageModule } from '@ionic/storage';

import { Camera } from '@ionic-native/camera';
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { FIREBASE_CONFIG } from '../configs/config';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ListJobPage } from '../pages/list-job/list-job';
import { ListApplicantPage } from '../pages/list-applicant/list-applicant';
import { TabsPage } from '../pages/tabs/tabs';
import { ContactPage } from '../pages/contact/contact';
import { SettingPage } from '../pages/setting/setting';
import { AboutPage } from '../pages/about/about';

import { JobProvider } from '../providers/job/job';
import { LoaderService } from '../services/loaderService';
import { ToastService } from '../services/toastService';
import { UserProvider } from '../providers/user/user';
import { UntilHelper } from '../helpers/until.helper';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        RegisterPage,
        ListJobPage,
        ListApplicantPage,
        TabsPage,
        ContactPage,
        SettingPage,
        AboutPage,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        FormsModule,
        AngularFireModule.initializeApp(FIREBASE_CONFIG),
        AngularFireDatabaseModule,
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        RegisterPage,
        ListJobPage,
        ListApplicantPage,
        TabsPage,
        ContactPage,
        SettingPage,
        AboutPage,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        Camera,
        AngularFireDatabase,
        AngularFireAuth,
        JobProvider,
        LoaderService,
        ToastService,
        UntilHelper,
        UserProvider
    ]
})
export class AppModule { }
