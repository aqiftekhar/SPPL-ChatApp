import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// import {getDatabase} from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyA-O4RzsCZL9RNirl7TbE3Ivft2OFqNwEg",
  authDomain: "spplapp.firebaseapp.com",
  databaseURL: "https://spplapp-default-rtdb.firebaseio.com",
  projectId: "spplapp",
  storageBucket: "spplapp.appspot.com",
  messagingSenderId: "1079316273917",
  appId: "1:1079316273917:web:02abad81cc8083b804fc94"
};

let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}
const auth = app.auth();

//  const db = app.database; firebase.database;

// const db = getDatabase(app);

export {  auth, firebase };

// class Fire {

  
//   constructor(){
//     this.init();
//     this.checkAuth();
//   }
//   init = () =>{
//     let app;
//     debugger;
//     // firebase.initializeApp(firebaseConfig);
//     if (!firebase.apps.length) {
    
//       app = firebase.initializeApp(firebaseConfig)
//     } 
//     // if (firebase.apps.length === 0) {
//     //   firebase.initilizeApp({
//     // apiKey: "AIzaSyB6f1DVymMmp0k1fhseFTzs-2h40IQiVRI",
//     // authDomain: "spplchat.firebaseapp.com",
//     // databaseURL: "https://spplchat-default-rtdb.firebaseio.com",
//     // projectId: "spplchat",
//     // storageBucket: "spplchat.appspot.com",
//     // messagingSenderId: "100540490043",
//     // appId: "1:100540490043:web:38af65bc1d9bf97762571e"
//     //   })
      
//     // }
//   };
//   checkAuth = () => {
//     firebase.auth().onAuthStateChanged(user=> {
//       debugger;
//       if (!user) {
//         // firebase.auth().signInAnonymously();
//       }
//     });
//   };


  // send = messages => {
  //   messages.forEach(item => {
  //     const message = {
  //       text: item.text,
  //       timestamp: firebase.database.TIMESTAMP,
  //       user : item.user
  //     }
  //     debugger;
  //     this.db.push(message);
    
  //   });
 
//   };
//   parsse = message => {
//     const {user, text, timestamp} = message.eval();
//     const {key: _id} = message;
//     const createdAt = new Date(timestamp);

//     return{
//       _id,
//       createdAt,
//       text,
//       user

//     }
    
//   }

//   get = callback => {
//     debugger;
//     this.db.on('child_added', snapshot =>  callback(this.parsse(snapshot)));
//   }

//   off(){
//     this.db.off();
//   }

//   get db(){
//     debugger;
//     return firebase.database().ref("message");
//   }

//   get uid(){
//     debugger;
//     return(firebase.auth().currentUser || {}).uid;
//   }
// }

// export default new Fire;