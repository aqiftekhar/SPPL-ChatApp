import React from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { AntDesign , MaterialIcons  } from '@expo/vector-icons'; 
import useAxios from 'axios';
import {firebase} from '../FireAuthentcation';

// const reference = db.database.ref('/users/123');

export default class Home extends React.Component{
    constructor(props) {
        // debugger;
        super(props);   
        this.state = {
            user: props.route.params.user,
            hall: [],
            email: props.route.params.email
        }
        
        // console.log("users in Home PAge = " + this.state.user);
    };
     bookSeat = async () => {
        // console.log(this.props)
        debugger;
        const dbRef = firebase.database().ref("Halls");
        const snapshot = await dbRef.once('value');
        const value = snapshot.val();

        let keys = Object.keys(value);
        
        const getHallNames = keys.map( key => {
            return {
                key, ...value[key],
                
            }
        
        } );
        // console.log(getHallNames);
        this.setState( { hall: getHallNames } );
        // console.log("User is = " + this.state.user);
        // console.log("Hall is = " + JSON.stringify(this.state.hall));
        this.props.navigation.navigate("Halls", this.state);


        // useAxios.get( 'https://spplapp-default-rtdb.firebaseio.com/Halls.json' )
        // .then( response => {
        //     // debugger;
        //     // let hallnames = Object.values(response.data);
        //     // console.log(hallnames);
        //     let keys = Object.keys(response.data);
        
        //     const getHallNames = keys.map( key => {
        //         return {
        //             key, ...response.data[key],
                    
        //         }
            
        //     } );
        //     // console.log(getHallNames);
        //     this.setState( { hall: getHallNames } );
        //     // console.log("User is = " + this.state.user);
        //     // console.log("Hall is = " + JSON.stringify(this.state.hall));
        //     this.props.navigation.navigate("Halls", this.state);
        // } )
        // .catch( error => {
        //     console.log( error );
        //     // this.setState({error: true});
        // } );

        // console.log(this.state);
        // this.props.navigation.navigate("Halls", this.state);
        // this.props.navigation.navigate("Halls");
    };

    sharewithHR = () => {
        // this.props.navigation.navigate("Chat", {user: this.state.email});
        this.props.navigation.navigate("Chat");
    }

    render(){


        return(
            <View style={styles.container}>
                <View style={styles.circle}/>
                <View style={{marginTop: 64}}>
                    <Image source={require("../assets/Stewart-logo-black.png")} style={{width:240, height:45, alignSelf:"flex-start", resizeMode: "contain"}}/>
                </View>
                <View style={styles.containerIcons}>

                    <TouchableOpacity style={styles.menuTop} onPress={this.bookSeat} >
                        <View style={styles.buttons}>
                        <MaterialIcons name="event-seat" size={40} color="white" style={{fontWeight:"800"}}/>
                            <Text style={styles.HallsText}>Book your seat</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuNext} onPress={this.sharewithHR} >
                        <View style={styles.buttons}>
                        <AntDesign name="wechat" size={40} color="white" style={{fontWeight:"800"}}/>
                            <Text style={styles.ChatText}>Share with HR</Text>
                        </View>
                    </TouchableOpacity>

                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F4F5F7",
        // justifyContent: "center",
        // alignItems: "center"
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
    containerIcons:{
        alignSelf: "center",
        // right:10,
        // top:-20,
        alignItems: "center",
         marginTop: 64,
         alignContent: "center",
         justifyContent: "center",
         alignItems: "center"
    },
    buttons:{
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    menuTop:{
        width: 250,
        height: 50,
        paddingLeft: 20,
        // top:20,
        // flexDirection: "row",
        borderRadius: 50/2,
        backgroundColor: "#AE0000",

    },
    menuNext:{
        width: 250,
        height: 50,
        paddingLeft: 20,
        top:30,
        // flexDirection: "row",
        borderRadius: 50/2,
        backgroundColor: "#AE0000",

    },
    HallsText:{
          left: 10,
        justifyContent: "center",
        alignSelf: "center",
        fontWeight:"800",
        fontSize:20,
        color: "white"

    },
    ChatText:{
          top:2,
        justifyContent: "center",
        alignSelf: "center",
        fontWeight:"800",
        fontSize:20,
        color: "white",
        alignItems: "center",
        left: 10

    }
});