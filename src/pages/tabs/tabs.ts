import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { SettingPage } from '../setting/setting';

@IonicPage()
@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html'
})
export class TabsPage {
    homeRoot = HomePage
    settingRoot = SettingPage
    aboutRoot = AboutPage
    contactRoot = ContactPage

    constructor(public navCtrl: NavController) { }
}
