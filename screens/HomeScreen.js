import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet,Image } from 'react-native';
import firebase from 'firebase'
import ChatScreen from './ChatScreen';
import db from '../db';
import { ImagePicker } from 'expo';
import {uploadImageAsync} from '../ImageUtlis'
export default class HomeScreen extends Component {
  
    state = {
      username: '',
      password: '',
      name:"",
      image:null,
      caption:"",
      image2:null
      
    };
  finsishLoginOrRegistor = async()=>{

  }
  
  onLogin= async()=> {
    const { username, password } = this.state;
    let avatar= 'deafult.png';
    try{
      await firebase.auth().createUserWithEmailAndPassword(this.state.username,this.state.password)
      //await db.collection("users").add({id:this.state.username,name:this.state.name,online:true})
      //upload this.state.image called this.state.email to firebase storage
      
      if(this.state.image){
         avatar = this.state.username 
        await uploadImageAsync("Avatars",this.state.image,this.state.username)
        console.log("Upload result: ",avatar)
      }
      let name = this.state.name || this.state.username 
        await db.collection("users").doc(this.state.username).set({name:name,online:true,avatar: avatar})
    }catch(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode)
      if(errorCode=='auth/email-already-in-use'){
        try{
          await firebase.auth().signInWithEmailAndPassword(this.state.username,this.state.password)
          
          if(this.state.image){
            avatar = this.state.username 
           await uploadImageAsync("Avatars",this.state.image,this.state.username)
           console.log("Upload result: ",avatar)
           await db.collection("users").doc(this.state.username).update({avatar:avatar})
         }
         await db.collection("users").doc(this.state.username).update({online:true})
         if(this.state.name){
          await db.collection("users").doc(this.state.username).update({name:this.state.name})
         }
          Alert.alert('Login successful')
         
        }catch(error){
           // Handle Errors here.
          var errorCode = error.code;
         var errorMessage = error.message;
        // ... 
        
        }
      }
    } 
  }
  pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image2: result.uri });
      
    }
  };
  uplaodimage=async()=>{
    await uploadImageAsync("uploadimages",this.state.image2,this.state.username)
      await db.collection("users").doc(this.state.username).update({caption:this.state.caption})
      Alert.alert('Uplaod successful')
  }


  render() {
    return (
      <View style={styles.container}>
       {
         this.state.image&&
        <Image
                    style={{width: 100, height: 100}}
                    source={{uri: this.state.image}}
                  />
       } 
        <TextInput
          autoCapitalize= "none"
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />
         <TextInput
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
          placeholder={'Display Name'}
          style={styles.input}
        />
        <Button
          title={'Login/Register'}
          style={styles.input}
          onPress={this.onLogin.bind(this)}
        />
        <Button
          title={'Upload Profile Pic'}
          style={styles.input}
          onPress={this.pickAvatar}
        />
         {
         this.state.image2&&
        <Image
                    style={{width: 400, height: 200}}
                    source={{uri: this.state.image2}}
                  />
       } 
       <TextInput
          value={this.state.caption}
          onChangeText={(caption) => this.setState({ caption })}
          placeholder={'Caption Name'}
          style={styles.input}
        />
         <Button
          title={'Select Pic For Chat'}
          style={styles.input}
          onPress={this.pickImage}
        />
        <Button
          title={'Uplaod Pic For Chat'}
          style={styles.input}
          onPress={this.uplaodimage}
        />
      </View>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});
