import React, {useState, useEffect} from 'react';
import firebase from 'firebase/compat';
import {View, Text, StyleSheet, TouchableOpacity, Image, LogBox, Alert  } from "react-native";
// import useAxios from 'axios';
import { MaterialIcons } from '@expo/vector-icons'; 
import { FlatList } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
// import {firebase} from '../FireAuthentcation';
import moment from 'moment';
import * as _ from 'lodash';
import { rest } from 'lodash';

  export default class Seats extends React.Component{
    constructor(props) {
        super(props);   

        this.state = {
            hallNames: props.route.params.hall,
            seats: props.route.params.seats,
            user: props.route.params.user,
            email: props.route.params.email,
            selectedHall: props.route.params.selectedHall,
            reservedSeats: props.route.params.Reserved,
             selectedItem: {},
            date: new Date() 
        }

         debugger;
         console.log(this.state.seats);
         console.log("Reserved Seats = " + this.state.reservedSeats);
        
        // console.log(this.state.Area1seats);
    };
    static getDerivedStateFromProps(props, state) {
        debugger;
        if (props.route.params !== state) {
            return{
                seat : props.route.params.seat > state.seat,
                selectedItem: state.selectedItem,
                email: state.email,
                // selectedItem: props.route.params.selectedItem > state.selectedItem
            }
        }
        // if (props.route.params.seat !== state.seat) {
        //   return {
        //     isScrollingDown: props.currentRow > state.lastRow,
        //     lastRow: props.currentRow,
        //   };
        // }
    
        // Return null to indicate no change to state.
        return null;
      }
    created() {
        LogBox.ignoreLogs([
          'DatePickerIOS has been merged with DatePickerAndroid and will be removed in a future release.',
          'StatusBarIOS has been merged with StatusBar and will be removed in a future release.',
          'DatePickerAndroid has been merged with DatePickerIOS and will be removed in a future release.'
        ]);
      }
    componentDidMount() {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        LogBox.ignoreLogs([
            'Warning: componentWillMount has been renamed, and is not recommended for use.',
            'Warning: componentWillReceiveProps has been renamed, and is not recommended for use.',
            'Warning: componentWillUpdate has been renamed, and is not recommended for use.',
            'Warning: DatePickerAndroid has been merged with DatePickerIOS and will be removed in a future release.',
        ]);
    }



    selectSeat = async (item) => {

        debugger;
        if (this.state.selectedItem.Id == item.Id) {
            await Alert.alert('SPPL Seat Reservation', 'Are you sure you want to cancel previous booking?', [
                {
                  text: 'Cancel',
                  onPress: () => console.log("cancel Pressed"),
                  style: 'cancel', 
                },
                { text: 'Yes', onPress: () => this.DeleteBooking(item) },
              ]);            
        }
        else if(Object.keys(this.state.selectedItem).length == 0 ){
            await Alert.alert('SPPL Seat Reservation', 'Are you sure you want to reserve this seat?', [
                {
                  text: 'Cancel',
                  onPress: () => this.cancelSeat(item),
                  style: 'cancel',
                },
                { text: 'Yes', onPress: () => this.bookSeat(item) },
              ]);
        } 
        else if (this.state.selectedItem.Id !== item.Id) {
            await Alert.alert('SPPL Seat Reservation', 'You have already booked ' + this.state.selectedItem.key + '. Please cancel your previous booking to change your seat.', [
                // {
                //   text: 'Cancel',
                //   onPress: () => this.cancelSeat(item),
                //   style: 'cancel',
                // },
                { text: 'OK' },
              ]);
        }      

     }
     bookSeat = async (item) => {
        // if(this.isUserBookedSeat(item) == true){
        //     debugger;
                     
        // }
        var booking = await this.isUserBookedSeat(item);
debugger;
        // console.log("checkBooking = " + checkBooking);
        if(booking)
        {
            this.setState({selectedItem: item });  
        }
        console.log(this.state.selectedItem);
     }
     cancelSeat = async(item) => {

        await this.setState({selectedItem : {}});
     }
     
     DeleteBooking = async(item) =>{
        await this.setState({selectedItem : {}});
        const date = moment(this.state.date).format('DDMMYYYY');
        const dbRef =  firebase.database().ref("ReservedSeats");
        
        this.DeleteSeat(dbRef,item,date);
               
     }
     isUserBookedSeat = async(item) => {
         debugger;
         const db = firebase.database().ref("ReservedSeats"); 
         const snap= await db.once('value');
         const val = snap.val();
         let date = moment(this.state.date).format('DDMMYYYY');
        //  console.log(val);
        //  let user = JSON.parse(this.state.user);
        //  console.log(user);
         debugger; 
        // let date = '21032022';
        let filterAllBookings = _.assign(..._.flatMap(val, (seats, HallKey) =>
        _.flatMap(seats, (content, seatKey) =>
          _.mapKeys(content.Bookings, (_, bookingKey) =>
            `${HallKey}_${seatKey}_${bookingKey}`))
         )); 

    //   let dateFilter1 = [date];
    //         debugger;
    //         let filterByDate1 = _.pickBy(filterAllBookings, (value, key) =>
    //             _.some(dateFilter1, str => _.includes(key, str))
    //             );

    //             console.log(filterByDate1);
    //             let emailFilter1 = [this.state.email];

    //             let filterByEmail1 = _.filter(filterByDate1, (value) =>
    //             _.some(emailFilter1, str => _.includes(value, str)) 
    //             ); 
    //             console.log(filterByEmail1);

    //Final
      if (Object.keys(filterAllBookings).length > 0) {
            console.log(filterAllBookings);

            let dateFilter = [date];
            debugger;
            let filterByDate = _.pickBy(filterAllBookings, (value, key) =>
                _.some(dateFilter, str => _.includes(key, str))
                );
            
            if (Object.keys(filterByDate).length > 0) {
                debugger;
                console.log(filterByDate); 
                // let emailFilter = {BookedBy : this.state.email}; 
                // let filterByEmail = _.some(filterByDate, emailFilter);

                let emailFilter = [this.state.email];

                let filterByEmail = _.filter(filterByDate, (value) =>
                _.some(emailFilter, str => _.includes(value, str)) 
                ); 
debugger;
                // console.log(filterByEmail);

                if (Object.keys(filterByEmail).length > 0) {
                    //Show Already Bookings
                    debugger;
                    Alert.alert('SPPL Seat Reservation', 'You have already booked your seat for ' + moment(this.state.date).format('DD MMM YYYY') + '. Please cancel your previous booking to change your seat.', [
    
                        { text: 'OK' }, 
                      ]);
                    return false;
                }
                else{
                    //Reserve new Seat
                    debugger;
                    const dbUpdate = await firebase.database().ref("ReservedSeats");
                    return await this.ReserveSeat(dbUpdate,item,date);
                    // await dbUpdate.child(this.state.selectedHall).update({
                    //     [item.key]:
                    //     {
                    //         Id: item.Id,
                    //         "Bookings": {
                    //             [date]:{
                    //                 // "BookedAt" : moment([this.state.date]).format('DD/MM/YYYY HH:mm:ss'),
                    //                 // "BookedBy" : this.state.email
                    //                 "BookedAt" : moment(this.state.date).format('DD/MM/YYYY HH:mm:ss'),
                    //                 "BookedBy" : this.state.email
        
                    //             }
                    //         }    
                    //     }
                        
                    // });

                }
                // console.log(emailFilter);   

                // let filterByEmail = _.pickBy(filterByDate, (value, key) =>
                // _.some(emailFilter, str => _.includes(key, str))
                // );
                // console.log(filterByEmail);
            } else{
                const dbUpdate = await firebase.database().ref("ReservedSeats");
                return await this.ReserveSeat(dbUpdate,item,date);
            }
                
        }
         
        //  let date = moment(this.state.date).format('DDMMYYYY');
        // const dbRefReserved = firebase.database().ref("ReservedSeats/"  + this.state.selectedHall + "/" + item.key);
        // const dbRefReserved = firebase.database().ref("ReservedSeats/")
                                // .orderByChild(this.state.selectedHall);
                                // .orderByKey('15032022');
                                // .equalTo('15032022');
        // const snapshotResered = await dbRefReserved.once('value');
        
        // if (snapshotResered.val() != null){
            // const responseReserved = snapshotResered.val();
            // if (responseReserved.Bookings.hasOwnProperty(date)) {
            //     Alert.alert('SPPL Seat Reservation', 'You have already booked ' + this.state.selectedItem.key + ' for ' + moment(this.state.date).format('DD/MMM/YYYY') + '. Please cancle your previous booking to change your seat.', [
    
            //         { text: 'OK' },
            //       ]);
            //     return false;
            // } else {
            //     debugger;
                
            //     // const dbPush = dbUpdate.push();

            //     return true;
                
            // }
        // }
        //  else{
            //  debugger;
            // console.log("item not exist");
            //  let date = moment(this.state.date).format('DDMMYYYY');
            //  const dbUpdate = await firebase.database().ref("ReservedSeats");
            // const dbUpdateSnapshot = await dbUpdate.once('value');
            // let seat = item.key;
            // let hall = this.state.selectedHall;

            // var json = {

            //         [item.key]:
            //         {
            //             Id: item.Id,
            //             "Bookings": {
            //                 [date]:{
            //                     "BookedAt" : moment(this.state.date).format('DD/MM/YYYY HH:mm:ss'),
            //                     "BookedBy" : "this.state.user.email"

            //                 }
            //             }    
            //         }
                        

            // }
            // await dbUpdate.child(this.state.selectedHall).update({
            //     [item.key]:
            //     {
            //         Id: item.Id,
            //         "Bookings": {
            //             [date]:{
            //                 "BookedAt" : moment([this.state.date]).format('DD/MM/YYYY HH:mm:ss'),
            //                 "BookedBy" : this.state.user.email

            //             }
            //         }    
            //     }
    
            // });

            // await firebase.database().ref("ReservedSeats").set(
                            
            //             );
            // var node = dbUpdate.push(date);
            // dbUpdate.push().set(
            //     {
            //         date:
            //             {
            //                 Id: item.Id,
            //                 Bookings: {
            //                     date:{
            //                         BookedAt : moment(this.state.date).format('DD/MM/YYYY HH:mm:ss'),
            //                         BookedBy : this.state.user.email

            //                     }
            //                 }    
            //         }
            //     }
            // );


            // dbUpdate.set()
            // await dbUpdate.push({
            //     Id: item.Id,
            //     Bookings: {
            //         date:{
            //             BookedAt : moment(this.state.date).format('DD/MM/YYYY HH:mm:ss'),
            //             BookedBy : this.state.user.email

            //         }
            //     }                
            // })
            // await dbUpdate.child(item.key);

            // await dbUpdate.child(item.key).set();
            // await dbUpdate.child(item.key).set(),{
            //     Id: item.Id,
            //     Bookings: {
            //         date:{
            //             BookedAt : moment(this.state.date).format('DD/MM/YYYY HH:mm:ss'),
            //             BookedBy : this.state.user.email

            //         }
            //     }
            // };
        //      return true;
        //  }
        // let seat = responseReserved.filter(x=>x.key == '15032022').

        return true;
        // console.log(responseReserved);
        // console.log(this.state.user);
        // if (responseReserved.BookedBy == this.state.user.) {
            
        // }
     }
     ReserveSeat = async (dbUpdate,item,date) =>{            
        const dbGetSelectedHall = await dbUpdate.child(this.state.selectedHall);
        const seatRecordExist = await this.isSeatDataExist(dbGetSelectedHall, dbUpdate , item);

        if(seatRecordExist == null) {         
            await dbUpdate.child(this.state.selectedHall).update({
                [item.key]:
                {
                    Id: item.Id,
                    "Bookings": {
                        [date]:{
                            // "BookedAt" : moment(this.state.date).format('DD/MM/YYYY HH:mm:ss'),
                            "BookedAt" : moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
                            "BookedBy" : this.state.email 

                        }
                    }    
                }
    
            });  
        }else {
           const getBookings = seatRecordExist;      
           const mergedBookings = _.merge({
                                        [date]:{
                                                "BookedAt" : moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
                                                "BookedBy" : this.state.email
                                            }
                                      },getBookings); 
          
            await dbUpdate.child(this.state.selectedHall).child(item.key).child("Bookings").set(mergedBookings);  
        }  
        return true;  
     }

     isSeatDataExist = async(dbGetSelectedHall , dbUpdate , item) =>
     {
        const halls =  await (await dbGetSelectedHall.get()).val();
        let recordExist = null;

        if(halls != null)
        {
            let dbGetSeat = await dbUpdate.child(this.state.selectedHall);
            if(dbGetSeat != null)
            {
                dbGetSeat = dbGetSeat.child(item.key);
                const seatVal = await (await dbGetSeat.get()).val();
               
                if(seatVal != null)
                {
                    const dbGetSeatBookings = await dbGetSeat.child("Bookings");
                    const seatBookings = await (await dbGetSeatBookings.get()).val();
                   
                    if(seatBookings != null)
                    {
                        recordExist = seatBookings; 
                    }else {
                        recordExist = null;
                    }
                }else {
                    recordExist = null;
                }
            }else {
                    recordExist = null;
                }
        }
         return recordExist;
     }
     DeleteSeat = async(dbRef,item,date) =>{
        debugger;
        const dbGetHall = dbRef.child(this.state.selectedHall);
        
        if(dbGetHall != null)
        {
            const dbDeleteSeat = dbGetHall.child(item.key);
            if((await dbDeleteSeat.get()).val() != null)
            {
                const dbGetBookings = dbDeleteSeat.child("Bookings");
                
                if((await dbGetBookings.get()).val() != null)
                {                    
                    const dbDeleteSeatDetail = dbGetBookings.child(date);

                    if((await dbDeleteSeatDetail.get()).val() != null)
                    {
                        const bookingsDetail = (await dbGetBookings.get()).val();

                        if(bookingsDetail != null)
                        {
                            if(Object.keys(bookingsDetail).length > 1)
                            {
                                dbDeleteSeatDetail.set(null);
                            }else {
                                dbDeleteSeat.set(null);
                            }
                        }
                    }
                }
            }
        }
     }   

     setDate = async(date) => {
         debugger;
        
        //  console.log(date);
         this.setState({ date: date ,selectedItem : {}});

        //  this.filterSeatsByDate();
         console.log(this.state.hallNames);
     }

     filterSeatsByDate = (item, bookingDate) =>{
        debugger;
        var data = this.state.reservedSeats.filter(seat => seat.Id ==item.Id).length > 0;
        if(data == true){
          var findSeat = this.state.reservedSeats.filter(seat => seat.Id == item.Id ).length > 0;
          if(findSeat){
              var Seat = this.state.reservedSeats.filter(seat => seat.Id == item.Id );
              if (Seat.length > 0) {
                  const keys = Object.keys(JSON.parse(JSON.stringify(Seat[0].Bookings))); 
                  const getBookings = keys.map( key => {
                      return {
                          key, ...Seat[0].Bookings[key], 
                          
                      }
                  } );
                   let date = moment(new Date(bookingDate) );
                  let formatedDate = moment(date).format('DDMMYYYY');
                  const findSeatsToday = getBookings.filter(x=>x.key == formatedDate); 
                  if (findSeatsToday.length > 0) {
                    debugger;
                    const BookedBy = getBookings.filter(x=>x.BookedBy == this.state.email);
                    if (BookedBy.length > 0) {
                        if (findSeatsToday.filter(x=>x.key == date).length > 0) {
                            if (moment(date).format('DDMMYYYY') == moment(this.state.date).format('DDMMYYY')) {
                                this.setState({selectedItem: item});
                            }
                        }
                        
                    }
                      return true;
                  } else{

                      return false;
                  }
              }
          }
      }
      else{
          return false;
      }
     }

     isReserved = (item) => {
        // debugger;
        // console.log(this.date.Date);
        // let date = this.date;
        // let formatedDate = moment(date).format('DDMMYYYY');
        return  this.filterSeatsByDate(item, this.state.date);
        
        //   var data = this.state.reservedSeats.filter(seat => seat.Id ==item.Id).length > 0;
        //   if(data == true){
        //     var findSeat = this.state.reservedSeats.filter(seat => seat.Id == item.Id ).length > 0;
        //     if(findSeat){
        //         var Seat = this.state.reservedSeats.filter(seat => seat.Id == item.Id );
        //         if (Seat.length > 0) {
        //             const keys = Object.keys(JSON.parse(JSON.stringify(Seat[0].Bookings))); 
        //             const getBookings = keys.map( key => {
        //                 return {
        //                     key, ...Seat[0].Bookings[key], 
                            
        //                 }
        //             } );
        //             let date = new Date();
        //             let formatedDate = moment(date).format('DDMMYYYY');
        //             const findSeatsToday = getBookings.filter(x=>x.key == formatedDate); 
        //             if (findSeatsToday.length > 0) {
        //                 return true;
        //             } else{
        //                 return false;
        //             }
        //         }
                

        //     }
        // }
        // return data;

       }

       getColor = (item) => {
        //   debugger;
        var status =  this.filterSeatsByDate(item, this.state.date);
        switch(status) {
            case true:
                return styles.seatBooked
            case false:
                return styles.seatAvailable
           
        }
      }

      render(){

            if(this.state.seats == null)
            {
                console.log("result is null");
                return <Text>Loading...</Text>
            }


       return(

        <View style={styles.container}> 
            {/* <View style={styles.circle}/> */}
            <View style={{marginTop: 64}}>
                <Image source={require("../assets/Stewart-logo-black.png")} style={{width:240, height:45, alignSelf:"flex-start", resizeMode: "contain"}}/>
                
            </View>
<View style={{width:"100%", flexDirection:"row-reverse"}}> 
<DatePicker
          style={styles.datePickerStyle}
          date={this.state.date} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="select date"
          format="DD/MMM/YYYY"
        //   minDate="01-01-2016"
        //   maxDate="01-01-2019"
            minDate={new Date()}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              //display: 'none',
              position: 'relative',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 0,
            },
          }}
          onDateChange={(date) => {
            //   debugger;
            // Load Next Day's Booked Seats
            this.setDate(date);
          }}
        />
</View>
          <View>
          <FlatList style={styles.flatListArea1} 
                                contentContainerStyle={{margin:0}}
                                data={this.state.seats}
                                numColumns={4}
                                
                                showsHorizontalScrollIndicator={false} 
                                renderItem={({item, index}) => 
                                
                                            <View style={styles.containerIcons} key={item}>
                                                <TouchableOpacity 
                                                style={this.state.selectedItem === item ? styles.menuSelected : this.getColor(item) }  
                                                onPress={ () => this.selectSeat(item)}
                                                disabled={this.isReserved(item)}
                                                >
                                                    <View style={styles.buttons}>
                                                        <Text style={styles.HallsText} key={item.key}>{item.Id}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>}

                 /> 

     {/* Stackoverflow Solution */}
                            {/* <FlatList
                                style={styles.flatListArea1}
                                contentContainerStyle={{ margin: 0 }}
                                data={this.state.seats}
                                numColumns={4}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <View style={[styles.containerIcons, { backgroundColor: this.isReserved(item) ? "#FAFAFA" : "white" }]} key={index}>
                                        <TouchableOpacity
                                            style={this.state.selectedItem === item ? styles.menuSelected : styles.menuTop}
                                            onPress={() => this.selectSeat(item)}
                                            disabled={this.isReserved(item)}
                                        >
                                            <View style={styles.buttons}>
                                                <Text
                                                    style={[styles.HallsText, { backgroundColor: this.isReserved(item) ? "#CCC" : "white" }]}
                                                    key={item.key}
                                                >
                                                    {item.Id}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            /> */}
            {/* Stackoverflow Solution */}

            {/* start here */}

            {/* <View style={{flexDirection: "row",  width:"100%", top:10 }}>
                <View style={{justifyContent : "flex-start", width:"50%"}}> 
                
                <View style={{ width: "100%", height:330 }}>
                <FlatList style={styles.flatListArea2} 
                                contentContainerStyle={{margin:0}}
                                data={this.state.Area2seats}
                                numColumns={2}
                                
                                showsHorizontalScrollIndicator={false} 
                                renderItem={({item}) => 
                                
                                            <View style={styles.containerIcons} key={item}>
                                                <TouchableOpacity style={styles.menuTop}  onPress={ () => this.selectSeat(item)}>
                                                    <View style={styles.buttons}>
                                                    <MaterialIcons name="event-seat"  size={40} color="white" style={{fontWeight:"800",left:-13, top:0, alignSelf: 'center'}}/>
                                                        <Text style={styles.HallsText} key={item.key}></Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>}
                                
                                
                            />
                </View>
                <View style={{backgroundColor: "white", width: "100%", height:50}}>

                </View>
                <View style={{ width: "100%", height:500}}>
                        <FlatList style={styles.flatListArea3} 
                            contentContainerStyle={{margin:0}}
                            data={this.state.Area3seats}
                            numColumns={2}
                            showsHorizontalScrollIndicator={false} 
                            renderItem={({item}) => 
                            
                                        <View style={styles.containerIcons} key={item}>
                                            <TouchableOpacity style={styles.menuTop}  onPress={ () => this.selectSeat(item)}>
                                                <View style={styles.buttons}>
                                                <MaterialIcons name="event-seat"  size={40} color="white" style={{fontWeight:"800",left:-13, top:0, alignSelf: 'center'}}/>
                                                    <Text style={styles.HallsText} key={item.key}></Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>}
                            
                            
                        />
                </View>
                

                   
                    
                </View>
                <View style={{flexDirection: "column", justifyContent : "flex-end", width:"50%", height:"100%"}}> 
                <FlatList style={styles.flatListArea1} 
                    contentContainerStyle={{margin:0}}
                    data={this.state.Area1seats}
                    numColumns={2}
                    showsHorizontalScrollIndicator={false} 
                    renderItem={({item}) => 
                    
                                <View style={styles.containerIcons} key={item}>
                                    <TouchableOpacity style={styles.menuTop}  onPress={ () => this.selectSeat(item)}>
                                        <View style={styles.buttons}>
                                        <MaterialIcons name="event-seat"  size={40} color="white" style={{fontWeight:"800",left:-13, top:4, alignSelf: 'center'}}/>
                                            <Text style={styles.HallsText} key={item.key}></Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>}
                    
                    
                />
                    </View>
            </View>
            
            <View style={{width:"100%", height:30}}>

            </View> */}

          </View>

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
        // backgroundColor: "red"
        // position: 'absolute'
    },
    flatListArea1:{
        width: "95%",
        height: '100%',
        // flexDirection: 'column',
        alignSelf: 'flex-end',
        // flex : 1,
        // flexGrow :1,
        // backgroundColor:'black',
        // alignItems: 'center'
    },
    flatListArea2:{
        width: "95%",
        height: '100%',
        
        // flexDirection: 'column',
        // alignSelf: 'flex-start',
        // flex : 1,
        // flexGrow :1,
        // backgroundColor:'black',
        // alignItems: 'center'
    },
    flatListArea3:{
        top: 1,
        width: "95%",
        height: '100%',
        // flexDirection: 'column',
        alignSelf: 'flex-start',
        // flex : 1,
        // flexGrow :1,
        // backgroundColor:'black',
        // alignItems: 'center'
    },
    circle: {
        width: 500,
        height: 500,
        borderRadius: 500/2,
        backgroundColor: "#fff",
        // position: "absolute",
        // left: -120,
        // top: 50
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
         alignItems: "center",
        //  backgroundColor: 'blue',
            flex: 1,
            flexDirection: 'column',

    },
    buttons:{
        flexDirection: "row",
        alignItems: 'center',
        // justifyContent: 'flex-start'
    },
    seatAvailable:{
        width: 50,
        height: 50,
        paddingLeft: 20,
        
        top:0,
        // flexDirection: "row",
        borderRadius: 50/2,
        backgroundColor: "#AE0000",

    },
    seatBooked:{
        width: 50,
        height: 50,
        paddingLeft: 20,
        
        top:0,
        // flexDirection: "row",
        borderRadius: 50/2,
        backgroundColor: "#999999",

    },
    menuSelected:{
        width: 50,
        height: 50,
        paddingLeft: 20,
        
        top:0,
        // flexDirection: "row",
        borderRadius: 50/2,
        backgroundColor: "#0075aa",

    },
    menuNext:{
        width: 50,
        height: 50,
        paddingLeft: 20,
        top:30,
        // flexDirection: "row",
        borderRadius: 50/2,
        backgroundColor: "#AE0000",

    },
    HallsText:{
        // left: -5,
        // paddingLeft:-20,
        // top: 10,
        // justifyContent: "center",
        // alignSelf: "center",
        paddingTop: 10,
        left: -2,
        fontWeight:"800",
        fontSize:20,
        color: "white",
        alignItems:'center'

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

    },
    datePickerStyle: {
        justifyContent: "flex-end",
        width: 200,
        marginTop: 20,
        // backgroundColor: "#AE0000",
        color:"#AE0000",
      },
});