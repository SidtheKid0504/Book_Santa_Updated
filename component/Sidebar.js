import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View,
    TouchableOpacity
} from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import firebase from 'firebase';

export default class Sidebar extends React.Component{
    render() {
        return(
            <View style={styles.container}>
                <View style={styles.drawerContainer}>
                    <DrawerItems
                        {...this.props}
                    />
                </View>
                <View style={styles.logoutContainer}>
                    <TouchableOpacity
                    style={styles.logoutButton}
                    onPress= {() => {
                        this.props.navigation.navigate("WelcomeScreen");
                        firebase.auth().signOut();
                    }}
                    >
                        <Text>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    drawerContainer: {
        flex: 0.8
    },
    logoutContainer: {
        flex: 0.2,
        justifyContent: 'flex-end',
        paddingBottom: 30
    },
    logoutButton: {
        width: "100%",
        height: 30,
        justifyContent: "center", 
        padding: 10
    },
})


