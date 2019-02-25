import React from 'react';
import { ScrollView, StyleSheet, View, Text,TextInput,Button,Image } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import db from '../db.js'
import firebase from 'firebase'
import functions from 'firebase/functions'
export default class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };
  state={
    username:"",
    message:"",
    confirm:"",
    chats:[],
    imageEmail:null,
    
    
  }
  users=[]
  Create = async() => {
    console.log("clicked")
    //db.collection("messages").add({username:firebase.auth().currentUser.email,message:this.state.message,time:new Date()})
    const addMessage = firebase.functions().httpsCallable('addMessage');
    await addMessage ({message:this.state.message})
    this.setState({message:""})
    this.setState({confirm:"Added!!!!!!!"})
    
  }
  // ImageChange = async() => {
  //   console.log("Image clicked")
  //   //db.collection("messages").add({username:firebase.auth().currentUser.email,message:this.state.message,time:new Date()})
  //    await firebase.functions().httpsCallable('updateImage')();
  //    console.log("Done")
    
  // }
  sort=()=>{
    this.state.chats.sort(sort)
  }
  componentDidMount(){
       //go to database and get the information
       
       db.collection("users")
       .onSnapshot(querySnapshot => {
            this.users = [];
           querySnapshot.forEach(doc => {
               this.users.push({id:doc.id, ...doc.data()});
           });
           
           console.log("Users:  ", this.users.length)
       })
    //go to database and get the information
    db.collection("messages").orderBy("time")
      .onSnapshot(querySnapshot => {
          let chats = [];
          querySnapshot.forEach(doc => {
              chats.push({id:doc.id, ...doc.data()});
          });
          this.setState({chats:chats})
          console.log("Current chats : ", chats.join(", "))
      })
          //go to database and get the information about the image
    db.collection("images")
    .onSnapshot(querySnapshot => {
        let images = [];
        querySnapshot.forEach(doc => {
          images.push({id:doc.id, ...doc.data()});
        });
        this.setState({imageEmail:images[0].email})
        console.log("Image",images[0].email)
    })
  }
  avatarURL=(email)=>{
    return "Avatars%2F"+ this.users.find(u => u.id ===email).avatar.replace("@","%40")
  }
  imageURL=(email)=>{
    return "uploadimages%2F"+ email.replace("@","%40")
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>
                   Image
          </Text>
          {
            this.state.imageEmail &&
            <View>
            <Image
            style={{width: 400, height: 240}}
            source={{uri: `https://firebasestorage.googleapis.com/v0/b/praticeapp-e69b0.appspot.com/o/${this.imageURL(this.state.imageEmail)}?alt=media&token=16614739-fe44-4ce2-9401-a4f2dea86e02`}}
          />
          <Text>
          Caption: {this.users.find(u => u.id ===this.state.imageEmail).caption}
        </Text>
        <Text>
          Owner: {this.state.imageEmail}
        </Text>
        {/* //<Button onPress={this.ImageChange} title="Image" style={{ width: 100, paddingTop: 20 }} /> */}
        </View>
          }

          
        <View>
        {
            this.state.chats.map(chat=>
              <View key={chat.id}>
                <Text style={{fontWeight:"bold"}}>
                <Image
                    style={{width: 40, height: 40}}
                    source={{uri: `https://firebasestorage.googleapis.com/v0/b/praticeapp-e69b0.appspot.com/o/${this.avatarURL(chat.username)}?alt=media&token=16614739-fe44-4ce2-9401-a4f2dea86e02`}}
                  />
                  {this.users.find(u => u.id === chat.username).name} 
                  
                </Text>
                <Text>
                   {chat.message}
                </Text>
                
              </View>
              )
          }
          </View>
        <View>
          <Text style={{ fontWeight:'bold', width: 100, paddingTop: 20 }}>CHAT BOX</Text>
          {/* <TextInput
                        placeholder="Username"
                        
                        value={firebase.auth().currentUser.email}
                    /> */}
                    
                    <TextInput
                    placeholder="Message"
                        onChangeText={message => this.setState({ message })}
                        value={this.state.message}
                    />
                    <Button onPress={this.Create} title="Create" style={{ width: 100, paddingTop: 20 }} />
                    
                    <Text>{this.state.confirm}</Text>
          </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
