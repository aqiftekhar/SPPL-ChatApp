import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image,ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import {firebase} from '../FireAuthentcation';

  export default class Halls extends React.Component{
    constructor(props) {
        super(props);   
        this.state = {
            
            hallNames: props.route.params.hall,
            user: props.route.params.user,
            email: props.route.params.email,
            selectedHall: '',
            seats : [],
            Reserved: []
        }

    };
    selectSeat = async(item) => {        
        const dbRef = firebase.database().ref("Halls/" + item.key + "/");
        
        if(dbRef != null){
            const snapshot = await dbRef.once('value');

            if(snapshot != null){
                const response = snapshot.val();
            
                if(response != null){
                    let keys = Object.keys(response.Seats);  
        
                    const getSeats = keys.map( key => {
                        return {
                            key, ...response.Seats[key],
                            
                        }
                    
                    } );
                    
                    getSeats.sort((a, b) => a.Id - b.Id);
            
                    this.setState({seats: getSeats, selectedHall : item.key});
            
                    const dbRefReserved = firebase.database().ref("ReservedSeats/"  + item.key + "/");
                    let getReserved = [];
                    if(dbRefReserved != null)
                    {
                        const snapshotResered = await dbRefReserved.once('value');
                        if(snapshotResered != null)
                        {
                            const responseReserved = snapshotResered.val();
                            if(responseReserved != null)
                            {
                                let reservedKeys = Object.keys(responseReserved);
                                           
                                getReserved = reservedKeys.map( key => {
                                    return {
                                        key, ...responseReserved[key],
                                        
                                    }
                                
                                } );
                        
                            }   
                        }   
                    }
                    this.setState({Reserved : getReserved});
                    this.props.navigation.navigate("Seats", this.state);  
            
                    
                }   
            }
        }

     

     }
      render(){

            if(this.state.hallNames == null)
            {
                return <Text>Loading...</Text>
            }
            
       return(

        <View style={styles.container}> 
            <View style={styles.circle}/>
            <View style={{marginTop: 64}}>
                <Image source={require("../assets/Stewart-logo-black.png")} style={{width:240, height:45, alignSelf:"flex-start", resizeMode: "contain"}}/>
            </View>
        
        <FlatList style={{flex : 1, flexGrow :1}}  data={this.state.hallNames} renderItem={({item}) => 
        
                    <View style={styles.containerIcons} key={item}>
                        <TouchableOpacity style={styles.menuTop}  onPress={ () => this.selectSeat(item)}>
                            <View style={styles.buttons}>
                            <MaterialIcons name="room"  size={40} color="white" style={{fontWeight:"800"}}/>
                                <Text style={styles.HallsText} key={item.key}>{item.key}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>}
        
        
        />
        


    </View>
    
       )
   } 
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F4F5F7",
        height: "100%",
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
        marginTop: 35,
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
        top:10,
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