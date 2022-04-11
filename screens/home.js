import React from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { AntDesign , MaterialIcons  } from '@expo/vector-icons'; 
import {firebase} from '../FireAuthentcation';

export default class Home extends React.Component{
    constructor(props) {
        super(props);   
        this.state = {
            user: props.route.params.user,
            hall: [],
            email: props.route.params.email
        }
    };
     bookSeat = async () => {
        const dbRef = firebase.database().ref("Halls");
        const snapshot = await dbRef.once('value');
        const value = snapshot.val();

        let keys = Object.keys(value);
        
        const getHallNames = keys.map( key => {
            return {
                key, ...value[key],
                
            }
        
        } );
        this.setState( { hall: getHallNames } );
        this.props.navigation.navigate("Halls", this.state);
    };

    sharewithHR = () => {
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

                    {/* <TouchableOpacity style={styles.menuNext} onPress={this.sharewithHR} >
                        <View style={styles.buttons}>
                        <AntDesign name="wechat" size={40} color="white" style={{fontWeight:"800"}}/>
                            <Text style={styles.ChatText}>Share with HR</Text>
                        </View>
                    </TouchableOpacity> */}

                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F4F5F7",
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
        borderRadius: 50/2,
        backgroundColor: "#AE0000",

    },
    menuNext:{
        width: 250,
        height: 50,
        paddingLeft: 20,
        top:30,
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