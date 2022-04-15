import React, {useState, useEffect} from 'react';
import firebase from 'firebase/compat';
import {View, Text, StyleSheet, TouchableOpacity, Image, LogBox, Alert  } from "react-native";
import { FlatList } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import * as _ from 'lodash';
import * as Constant from '../shared/constants';

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
    };
    static getDerivedStateFromProps(props, state) {
        if (props.route.params !== state) {
            return{
                seat : props.route.params.seat > state.seat,
                selectedItem: state.selectedItem,
                email: state.email,
            }
        }
    
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
        this.isSeatBooked(true);
    }

    isSeatBooked = (isDateChangedOrFirstRender = false) =>{
        try {
            if(isDateChangedOrFirstRender)
            {
                this.props.LoadingService.showLoader("Searching Seat Please Wait");
            }
            let date = moment(new Date(this.state.date)).format(Constant.dateFormatWithoutDelimiter);
            let bookedItem = {};
            
            this.state.reservedSeats.filter(x=> 
                {
                    let isBooked= false;
                    let result = Object.entries(x.Bookings).filter((key)=> key.includes(date))[0]; 
                    if(result != undefined) {
                        if(result[1]?.BookedBy == this.state.email)
                        {
                            let bookedSeat = this.state.seats.filter(y=>y.Id == x.Id);
                            if(bookedSeat?.length == 1)
                            {
                                bookedItem = bookedSeat[0];
                                isBooked = true;  
                            }
                        }else{
                            isBooked = false;
                        }
                    }else{
                        isBooked = false;
                    }
                    return isBooked;
                }
            );
                this.setState({
                        selectedItem :bookedItem
                    });  
        } catch (error) {
            alert(error);
        }finally {
            if(isDateChangedOrFirstRender)
            {
                this.props.LoadingService.hideLoader();
            }
        }
     }

    selectSeat = async (item) => {
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

                { text: 'OK' },
              ]);
        }      

     }
     bookSeat = async (item) => {
        try {
            this.props.LoadingService.showLoader("Booking Seat...");

            var booking = await this.isUserBookedSeat(item);

            if(booking)
            {
                this.setState({selectedItem: item });  
            }

        } catch (error) {
            alert(error);
        }finally {
            this.props.LoadingService.hideLoader();
        }
       
     }
     cancelSeat = async(item) => {

        await this.setState({selectedItem : {}});
     }
     
     DeleteBooking = async(item) =>{
         try {
            this.props.LoadingService.showLoader("Cancelling Previous Booking...");

            const date = moment(new Date(this.state.date)).format(Constant.dateFormatWithoutDelimiter);
            const dbRef =  firebase.database().ref("ReservedSeats");
            
            await this.DeleteSeat(dbRef,item,date);
         } catch (error) {
             alert(error);
         } finally {
            this.props.LoadingService.hideLoader();
         }    
     }
     isUserBookedSeat = async(item) => {
         try {
            const db = firebase.database().ref("ReservedSeats"); 
            const snap= await db.once('value');
            const val = snap.val();
            let date = moment(new Date(this.state.date)).format(Constant.dateFormatWithoutDelimiter);
    
            let filterAllBookings = _.assign(..._.flatMap(val, (seats, HallKey) =>
            _.flatMap(seats, (content, seatKey) =>
              _.mapKeys(content.Bookings, (_, bookingKey) =>
                `${HallKey}_${seatKey}_${bookingKey}`))
             )); 
    
             if (Object.keys(filterAllBookings).length > 0) {
                let dateFilter = [date];
    
                let filterByDate = _.pickBy(filterAllBookings, (value, key) =>
                    _.some(dateFilter, str => _.includes(key, str))
                    );
                
                if (Object.keys(filterByDate).length > 0) {
    
                    let emailFilter = [this.state.email];
                    let hallKey = "";
                    let seatId ="";
                    let filterByEmail = _.filter(filterByDate, (value,objKey) =>
                    _.some(emailFilter, str =>
                        {
                            let result = _.includes(value, str);
                            if(result)
                            {                            
                                let arr = objKey.split('_');
                                hallKey = arr.length > 0 ? arr[0] : "";
                                seatId = arr.length > 1 ? arr[1]:"";
                            }
                            return result;
                        }
                         ) 
                    ); 
    
                    if (Object.keys(filterByEmail).length > 0) {
                        //Show Already Bookings
                        debugger;
                        Alert.alert('SPPL Seat Reservation', 'You have already booked your '+seatId+' in '+ hallKey+' for ' + moment(new Date(this.state.date)).format('DD MMM YYYY') +'. Please cancel your previous booking to change your seat.', [
        
                            { text: 'OK' }, 
                          ]);
                        return false;
                    }
                    else{
                        //Reserve new Seat
                        const dbUpdate = await firebase.database().ref("ReservedSeats");
                        return await this.ReserveSeat(dbUpdate,item,date);
                    }
    
                } else{
                    const dbUpdate = await firebase.database().ref("ReservedSeats");
                    return await this.ReserveSeat(dbUpdate,item,date);
                }
                    
            }    
         } catch (error) {
             alert(error);
         }
        return true;
     }

     ReserveSeat = async (dbUpdate,item,date) =>{            
        try {
            const dbGetSelectedHall = await dbUpdate.child(this.state.selectedHall);
            const seatRecordExist = await this.isSeatDataExist(dbGetSelectedHall, dbUpdate , item);
    
            if(seatRecordExist == null) {         
                await dbUpdate.child(this.state.selectedHall).update({
                    [item.key]:
                    {
                        Id: item.Id,
                        "Bookings": {
                            [date]:{
                                "BookedAt" : moment(new Date()).format(Constant.dateTimeFormat),
                                "BookedBy" : this.state.email 
    
                            }
                        }    
                    }
        
                });  
            }else {
               const getBookings = seatRecordExist;      
               const mergedBookings = _.merge({
                                            [date]:{
                                                    "BookedAt" : moment(new Date()).format(Constant.dateTimeFormat),
                                                    "BookedBy" : this.state.email
                                                }
                                          },getBookings); 
              
                await dbUpdate.child(this.state.selectedHall).child(item.key).child("Bookings").set(mergedBookings);  
            }  
            this.UpdateStateReserveSeat(dbUpdate); 
        } catch (error) {
            alert(error);
        } 
        return true;  
     }

     isSeatDataExist = async(dbGetSelectedHall , dbUpdate , item) =>
     {
         let recordExist = null;
         try {
            const halls =  await (await dbGetSelectedHall.get()).val();
    
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
         } catch (error) {
             alert(error);
         } 
         return recordExist;
     }
  
     DeleteSeat = async(dbRef,item,date) =>{
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
                            this.UpdateStateReserveSeat(dbRef);
                        }
                    }
                }
            }
        }
     }   
 
     UpdateStateReserveSeat = async(dbReserved)=>{
        const dbRefReserved =  await dbReserved.child(this.state.selectedHall);
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
            this.setState({reservedSeats : getReserved});
            this.isSeatBooked();
    }
   
    setDate = async(date,formatSeparator) => { 
        if(this.state.date != date)
        {
            date = this.parseDate(date,formatSeparator);
            this.setState({ date: date ,selectedItem : {}});
            this.isSeatBooked(true);            
        }
     }

     filterSeatsByDate = (item, bookingDate) =>{
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
                  let formatedDate = moment(new Date(date)).format(Constant.dateFormatWithoutDelimiter);
                  const findSeatsToday = getBookings.filter(x=>x.key == formatedDate); 
                  if (findSeatsToday.length > 0) {
                    debugger;
                    const BookedBy = getBookings.filter(x=>x.BookedBy == this.state.email);
                    if (BookedBy.length > 0) {
                        if (findSeatsToday.filter(x=>x.key == date.format(Constant.dateFormatWithoutDelimiter)).length > 0) {
                            if (moment(new Date(date)).format(Constant.dateFormatWithoutDelimiter) == moment(new Date(this.state.date)).format(Constant.dateFormatWithoutDelimiter)) {                              
                                return false;
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
        return  this.filterSeatsByDate(item, this.state.date);
       }

       getColor = (item) => {
        var status =  this.filterSeatsByDate(item, this.state.date);
        switch(status) {
            case true:
                return styles.seatBooked
            case false:
                return styles.seatAvailable
        }
      }
      parseDate = (date,formatSeparator) => {
        var dateArr = date.split(formatSeparator);
        var month = moment().month(dateArr[1]).format("MM");
        var date = dateArr[0];
        var year = dateArr[2];
        return new Date(year, month-1,date);
      }
      
      render(){

            if(this.state.seats == null)
            {
                return <Text>Loading...</Text>
            }

       return(

        <View style={styles.container}> 
            <View style={{marginTop: 64}}>
                <Image source={require("../assets/Stewart-logo-black.png")} style={{width:240, height:45, alignSelf:"flex-start", resizeMode: "contain"}}/>              
            </View>

            <View style={{width:"100%", flexDirection:"row-reverse"}}> 
            <DatePicker
                    style={styles.datePickerStyle}
                    date={this.state.date} //initial date from state
                    mode="date" //The enum of date, datetime and time
                    placeholder="select date"
                    format={Constant.datePickerFormat}
                        minDate={new Date()}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
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
                        this.setDate(date,Constant.dateFormatDelimiter);
                    }}
                    />
            </View>

            <View style={styles.flatListView}>
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
            </View>
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
    flatListView:{
        marginTop:"5%",
        height:"75%"
    },
    flatListArea1:{
        width: "95%",
        height: '100%',
        alignSelf: 'flex-end',
    },
    flatListArea2:{
        width: "95%",
        height: '100%'
    },
    flatListArea3:{
        top: 1,
        width: "95%",
        height: '100%',
        alignSelf: 'flex-start'
    },
    circle: {
        width: 500,
        height: 500,
        borderRadius: 500/2,
        backgroundColor: "#fff"
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
        alignItems: "center",
        flex: 1,
        flexDirection: 'column',
    },
    buttons:{
        flexDirection: "row",
        alignItems: 'center',
    },
    seatAvailable:{
        width: 50,
        height: 50,
        paddingLeft: 20,  
        top:0,
        borderRadius: 50/2,
        backgroundColor: "#AE0000",

    },
    seatBooked:{
        width: 50,
        height: 50,
        paddingLeft: 20,  
        top:0,
        borderRadius: 50/2,
        backgroundColor: "#999999",

    },
    menuSelected:{
        width: 50,
        height: 50,
        paddingLeft: 20,
        top:0,
        borderRadius: 50/2,
        backgroundColor: "#0075aa",

    },
    menuNext:{
        width: 50,
        height: 50,
        paddingLeft: 20,
        top:30,
        borderRadius: 50/2,
        backgroundColor: "#AE0000",

    },
    HallsText:{
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
        color:"#AE0000",
      },
});