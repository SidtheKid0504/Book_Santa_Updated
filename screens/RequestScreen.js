import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    Modal, 
    KeyboardAvoidingView,
    ScrollView 
} from 'react-native';
import AppHeader  from "../component/Header";
import firebase from 'firebase';
import db from '../config';

export default class RequestScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            userID: firebase.auth().currentUser.email,
            bookName: '',
            description: '',
            requestedBookName: '',
            isBookRequestActive: '',
            bookStatus: "pending",
            requestID: '',
            userDocID: '',
            docID: ''
        }
    }

    componentDidMount() {
        this.getBookRequest();
        this.isBookRequestActive();
    }

    render() {
        console.log(this.state.isBookRequestActive)
        if (this.state.isBookRequestActive === true) {
            return(
                <View style={styles.container}>
                    <View style={{borderColor: "#fad6a5", borderWidth: 2, justifyContent: "center"}}>
                        <Text>Book Name: </Text>
                        <Text>{this.state.requestedBookName}</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <AppHeader title="Request Book"/>
                    <KeyboardAvoidingView style={styles.keyboardView}>
                        <TextInput
                            style={styles.formTextInput}
                            placeholder= {"Enter Book Name"}
                            onChangeText = {(text) => {
                                this.setState({
                                    bookName: text
                                });
                            }}
                            value = {this.state.bookName}
                        />
    
                        <TextInput
                            style={[styles.formTextInput, {width: "75%",height: 300}]}
                            placeholder= {"Enter Reason For Why You Want the Book"}
                            multiline
                            numberOfLines = {8}
                            onChangeText = {(text) => {
                                this.setState({
                                    description: text
                                });
                            }}
                            value = {this.state.description}
                        />
                        <TouchableOpacity
                            onPress= {()=> {
                                this.addRequest(this.state.bookName, this.state.description);
                            }}
                            style={styles.reqButton}
                        >
                            <Text>Request Book</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            )
            }
        }
        
    addRequest = (bookName, reasonToReq) => {
        var userID = this.state.userID;
        var randomRequestID = Math.random().toString(36).substring(7);
        db.collection("requested_books").add({
            userID: userID,
            bookName: bookName,
            reasonToRequest: reasonToReq,
            requestID: randomRequestID,
            bookStatus: "requested",
            date: firebase.firestore.FieldValue.serverTimestamp()
        });
        this.getBookRequest();
        this.setState({
            bookName: '',
            description: ''
        })
        return Alert.alert("Book Requested");
    }

    getBookRequest = () => {
        let bookRequest = db.collection('requested_books').
        where("userID", "==", this.state.userID).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.data().bookStatus !== "received") {
                    this.setState({
                        requestedBookName: doc.data().bookName,
                        bookStatus: doc.data().bookStatus,
                        requestID: doc.data().requestID,
                        docID: doc.id
                    });
                }
            })
        })
    }

    isBookRequestActive = () => {
        db.collection("users").where('email', '==', this.state.userID)
        .onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
                this.setState({
                    isBookRequestActive: doc.data().isBookRequestValid,
                    userDocID: doc.id
                });
            });
        })
    }

    updateBookStatus = () => {
        db.collection('requested_books').doc(this.state.docID)
        .update({
            bookStatus: "received",
        });

        db.collection('users').where("email", "==", this.state.userID).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                db.collection('users').doc(doc.id).update({
                    isBookRequestValid: false
                })
            }) 
        })
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    keyboardView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    formTextInput: {
        backgroundColor: "#ff9e9e",
        width: "75%",
        height: 35,
        marginTop: 20, 
        alignSelf: "center",
        borderRadius: 10,
        borderWidth: 1,
        padding: 10
    },
    reqButton: {
        width: '75%',
        height: 40,
        alignItems: "center", 
        justifyContent: 'center',
        borderWidth: 1.5,
        borderRadius: 10,
        backgroundColor:"#ffffe0",
        marginTop: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16,
    }
})