import React, {useState, useEffect} from 'react';
// import firebase from 'firebase/compat';
import {View, Text, StyleSheet, TouchableOpacity, Image,ScrollView } from "react-native";
// import useAxios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import useAxios from 'axios';
import {firebase} from '../FireAuthentcation';

  export default class Halls extends React.Component{
    constructor(props) {
        super(props);   
        // debugger;
        this.state = {
            
            hallNames: props.route.params.hall,
            user: props.route.params.user,
            email: props.route.params.email,
            selectedHall: '',
            seats : [],
            Reserved: []
        }
        // debugger;
        // console.log("Hall Users = " + this.state.user);
    };
    selectSeat = async(item) => {
        if(item.key != 'Dev-1') // Implementation only in Dev-1 till now
        {
            return;
        }
        // debugger;
        const dbRef = firebase.database().ref("Halls/" + item.key + "/");
        const snapshot = await dbRef.once('value');
        const response = snapshot.val();

        let keys = Object.keys(response.Seats);  
        
        const getSeats = keys.map( key => {
            return {
                key, ...response.Seats[key],
                
            }
        
        } );
        getSeats.sort((a, b) => a.Id - b.Id);

        this.setState( { seats: getSeats } );

        this.setState({selectedHall : item.key});

        const dbRefReserved = firebase.database().ref("ReservedSeats/"  + item.key + "/");
        const snapshotResered = await dbRefReserved.once('value');
        const responseReserved = snapshotResered.val();

        debugger;
        let reservedKeys = Object.keys(responseReserved);
            
        
        const getReserved = reservedKeys.map( key => {
            return {
                key, ...responseReserved[key],
                
            }
        
        } );

        this.setState({Reserved : getReserved});
        this.props.navigation.navigate("Seats", this.state);

        // var url = 'https://spplapp-default-rtdb.firebaseio.com/Halls/' + item.key + '/Seats.json';
        // // console.log(url);
        // useAxios.get( url)
        // .then( response => {


        //     let keys = Object.keys(response.data);
            
        
        //     const getSeats = keys.map( key => {
        //         return {
        //             key, ...response.data[key],
                    
        //         }
            
        //     } );


        //     getSeats.sort((a, b) => a.Id - b.Id);

        //     this.setState( { seats: getSeats } );

        //     this.setState({selectedHall : item.key});

        //     // console.log(this.state.selectedHall);
        //     // debugger;
        //     // const test = db.ref("/ReservedSeats/Dev-1").get()
        //     // var reservedSeatsList = [];
        //     // firebase.database().ref("ReservedSeats/Dev-1/").once('value', function (snapshot) {
        //     //     // Reserved(snapshot.val());
        //     //     // debugger;
        //     //     reservedSeatsList = snapshot.val();
                
                
        //     //     // this.setState({Reserved : snapshot.val()});
        //     //   });
        //     //   debugger;

        //     var reservedURI = 'https://spplapp-default-rtdb.firebaseio.com/ReservedSeats/' + item.key + '.json';
        //     useAxios.get( reservedURI)
        //     .then( response => {
        //         debugger;
        //         let reservedKeys = Object.keys(response.data);
            
        
        //         const getReserved = reservedKeys.map( key => {
        //             return {
        //                 key, ...response.data[key],
                        
        //             }
                
        //         } );

        //         this.setState({Reserved : getReserved});
        //         this.props.navigation.navigate("Seats", this.state);
        //     });
              
        //     // firebase.database().ref("ReservedSeats/Dev-1/").on("value").then((querySnapshot) => {
             
        //     //     // Loop through the data and store
        //     //     // it in array to display
        //     //     querySnapshot.forEach(element => {
        //     //         debugger;
        //     //         var data = element.data();
        //     //         this.console.log(data);
        //     //         Reserved(arr => [...arr , data]);
                      
        //     //     });
        //     //     console.log(this.state.Reserved);
        //     // })
            
        //     // console.log(this.state.Reserved);
        //     // console.log(this.state.hallNames);
            
        // } )
        // .catch( error => {
        //     console.log( error );

        // } );

     }
      render(){


            // const selectSeat = (key) => {
            //     console.log(key);
        
            // }
            if(this.state.hallNames == null)
            {
                console.log("result is null");
                return <Text>Loading...</Text>
            }
           
            // var components = this.state.hallNames.map( (hall,i) => {

                // return (
                //     <View style={styles.containerIcons} key={i}>
                //     <TouchableOpacity style={styles.menuTop}  onPress={selectSeat}>
                //         <View style={styles.buttons}>
                //         <MaterialIcons name="room"  size={40} color="white" style={{fontWeight:"800"}}/>
                //             <Text style={styles.HallsText} key={hall.key}>{hall.key}</Text>
                //         </View>
                //     </TouchableOpacity>
                //     </View>
                    
                // );
            // } );
       return(
            //      <FlatList data={this.state.hallNames} renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}/> 
            // {components } 

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
        //  flexGrow: 1,
        backgroundColor: "#F4F5F7",
        // justifyContent: "center",
        // alignItems: "center"
        height: "100%",
        // position: 'absolute'
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