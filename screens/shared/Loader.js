import React from "react";
import {View,Modal, Text, StyleSheet,ActivityIndicator } from "react-native";
import * as Constant from '../../shared/constants';

export default Loader = (props)=> {
        const toggleLoader = props.toggleLoader;
        const backgroundOpacity = (props.opacity == undefined) ? Constant.loaderOpacity : props.opacity;

        return(
           toggleLoader ?
           <View style={{...styles.container,opacity:backgroundOpacity}}>
              <View style={styles.modalView}>
              <ActivityIndicator size="large" color="#00ff00">
              </ActivityIndicator>
                {props?.message?.length > 0 && <Text style={styles.message}>{props.message}</Text>}
              </View>
           </View> : null
        );
}

const styles = StyleSheet.create({
      message:{
        textAlign:'center' ,
        fontWeight: 'bold',
        fontSize: 18,
      },
      container: {
        width:'100%',
        height:'100%',
        justifyContent: "center",
        alignItems: "center",
        position:'absolute',
        zIndex:1,
        backgroundColor:'grey'
       },
      modalView: {
        justifyContent: 'center' ,
        shadowColor: "#000",
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor:'white'
      }

});