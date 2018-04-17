import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms'
import { HttpModule, Http } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { IonTagsInputModule } from "ionic-tags-input";
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipsModule } from 'ionic-tooltips';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer'; 
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

import { PipesModule } from '../pipes/pipes.module';

import { Camera } from '@ionic-native/camera';
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { SocialSharing } from '@ionic-native/social-sharing';

import { FIREBASE_CONFIG } from '../configs/config';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { PostPage } from '../pages/post/post';
import { UserPage } from '../pages/user/user';
import { TabsPage } from '../pages/tabs/tabs';
import { ContactPage } from '../pages/contact/contact';
import { SettingPage } from '../pages/setting/setting';
import { AboutPage } from '../pages/about/about';
import { DetailUserPage } from '../pages/user/detail-user/detail-user';
import { PostAddPage } from '../pages/post/post-add/post-add';
import { UserEditPage } from '../pages/user/user-edit/user-edit';
import { ManagerPostPage } from '../pages/manager-post/manager-post';
import { DetailPostPage } from '../pages/post/detail-post/detail-post';
import { UpgradePage } from '../pages/upgrade/upgrade';
import { PostComponent } from '../components/post/post';
import { StatisticsPage } from '../pages/statistics/statistics';

import { UntilHelper } from '../helpers/until.helper';
import { FormHelper } from '../helpers/form.helper';

import { PostProvider } from '../providers/post/post';
import { LoaderService } from '../services/loaderService';
import { ToastService } from '../services/toastService';
import { UserProvider } from '../providers/user/user';
import { DataProvider } from '../providers/data/data';
import { UserService } from '../services/userService';
import { NetService } from '../services/netService';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        RegisterPage,
        PostPage,
        UserPage,
        TabsPage,
        ContactPage,
        SettingPage,
        AboutPage,
        DetailUserPage,
        PostAddPage,
        UserEditPage,
        ManagerPostPage,
        DetailPostPage,
        UpgradePage,
        PostComponent,
        StatisticsPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        FormsModule,
        TooltipsModule,
        AngularFireModule.initializeApp(FIREBASE_CONFIG),
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        IonicStorageModule.forRoot(),
        HttpModule,
        HttpClientModule,
        AutoCompleteModule,
        IonTagsInputModule,
        TagInputModule,
        BrowserAnimationsModule,
        PipesModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        RegisterPage,
        PostPage,
        UserPage,
        TabsPage,
        ContactPage,
        SettingPage,
        AboutPage,
        DetailUserPage,
        PostAddPage,
        UserEditPage,
        ManagerPostPage,
        DetailPostPage,
        UpgradePage,
        PostComponent,
        StatisticsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        HttpClient,
        Http,
        Camera,
        CallNumber,
        EmailComposer,
        AngularFireDatabase,
        AngularFireAuth,
        SocialSharing,

        UntilHelper,
        FormHelper,
        PostProvider,
        LoaderService,
        ToastService,
        UserProvider,
        DataProvider,
        UniqueDeviceID,
        UserService,
        NetService,
        File,
        FileChooser,
        FileTransfer,
        FilePath
    ]
})
export class AppModule { }
