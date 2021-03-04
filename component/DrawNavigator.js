import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View,
} from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { TabNavigator } from './BottomTab';
import  Sidebar  from './Sidebar';
import SettingScreen from '../screens/SettingScreen';
import MyDonationsScreen from '../screens/MyDonationsScreen';
import NotificationsScreen from '../screens/NotifScreen';

export const DrawerNavigator = createDrawerNavigator({
    Home: {
        screen: TabNavigator
    },
    My_Donations: {
        screen: MyDonationsScreen
    },
    Notifications: {
        screen: NotificationsScreen
    },
    Setting: {
        screen: SettingScreen
    }
    },
    {
        contentComponent: Sidebar
    },
    {
        initialRouteName: "Home"                                                              
    }
)
