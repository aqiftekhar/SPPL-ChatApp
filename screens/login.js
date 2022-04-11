import React from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import { auth } from "../FireAuthentcation";

export default class Login extends React.Component{
    constructor(props) {
        super(props);   
        this.state = {
            email: '',
            password: '',
            user: []
        };
    };

    continue = () => {
        if (this.state.email !== '' && this.state.password !== '') {
            auth.signInWithEmailAndPassword( this.state.email, this.state.password)
            .then((userCredential) => {
                console.log("login success");
                const user = userCredential.user;
                this.setState({user : JSON.stringify(user) });
                this.props.navigation.navigate("Home", this.state);
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
              });
           }
    };
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.circle}/>

                <View style={{marginTop: 64}}>
                    <Image source={require("../assets/Stewart-logo-black.png")} style={{width:240, height:45, alignSelf:"flex-start", resizeMode: "contain"}}/>
                </View>

                <View style={styles.LoginForm}>
                    <TextInput style={styles.inputUsername} placeholder="Email" onChangeText={(email) => this.setState({ email })} value={this.state.email}/>
                    <TextInput style={styles.inputUsername} placeholder="Password" onChangeText={(password) => this.setState({ password })}  value={this.state.password} secureTextEntry={true}/>
                </View>

                <View style={styles.containerContinue}>
                    <TouchableOpacity style={styles.continue} onPress={this.continue}>
                    <Ionicons name="arrow-forward" size={28} color="white" style={{fontWeight:"800", left:10}}/>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F4F5F7"
    },
    circle: {
        width: 500,
        height: 500,
        borderRadius: 500/2,
        backgroundColor: "#fff",
        position: "absolute",
        left: -120,
        top: -20
    },
    header: {

        fontWeight: "800",
        fontSize: 30,
        color: "#514E5A",
        marginTop: 32
    },
    LoginForm:{
        marginHorizontal: 35,
        // flexDirection: 'column', // inner items will be added vertically
        // flexGrow: 1,            // all the available vertical space will be occupied by it
        // justifyContent: 'space-between' // will create the gutter between body and footer
    },
    inputUsername: {
        marginTop: 42,
        marginLeft: 15,
        height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#BAB7C3",
        borderWidth:1,
        borderRadius: 30,
        paddingHorizontal: 16,
        color: "#514E5A",
        fontWeight: "600"
    },
    containerContinue:{
        right:10,
        top:-20,
        alignItems: "flex-end",
         marginTop: 64,
         alignContent: "center",
         justifyContent: "center"
    },
    continue:{
        width: 50,
        height: 50,
        borderRadius: 50/2,
        backgroundColor: "#AE0000",
        alignContent: "center",
        justifyContent: "center"
    }
});