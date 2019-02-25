import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch'


admin.initializeApp(functions.config().firebase)
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const onWriteUsers = functions.firestore
    .document('users/{id}')
    .onWrite(async(change, context) => {
        // Get an object with the current document value.
        // If the document does not exist, it has been deleted.
        const user = change.after.exists ? change.after.data() : null;
  
        // Get an object with the previous document value (for update or delete)
        const olduser = change.before.data();
        console.log("user=",user)
        console.log("Old user=",olduser)
        // perform desired operations ...
        let message=null
        //choices:user logged in,user logged out,user registered
        if(!olduser || user.online && !olduser.online){
             message="HI"
            
        }
        else if(!user.online && olduser.online){
            message="Bye"
        }
        if(message){
            await admin.firestore().collection("messages").add({username:"admin@admin.com",message:message+" "+user.name+"!",time:new Date()})
        }
      });

const help=["!hi:For a Hi message from the admin\n","!user: To display all the user in Chat\n"]

export const addMessage = functions.https.onCall(async(data, context) => {
    const message = data.message
    const email = context.auth!.token.email || null;
    //await admin.firestore().collection("messages").add({username:email,message:message,time:new Date()})
    console.log("It works")
    await admin.firestore().collection("messages").add({username:email,message:message,time:new Date()})
    if (data.message == "!hi"){
         await admin.firestore().collection("messages").add({username:"admin@admin.com",message:"Hi to "+email,time:new Date()})
    }else if(data.message == "!user"){
        const querySnapshot =await admin.firestore().collection("messages").get()
        const users = new Array()
        querySnapshot.forEach(doc => {
            const username =doc.data().username;
            if(!users.includes(username)){
                users.push(username)
            }
        });
        await admin.firestore().collection("messages").add({username:"admin@admin.com",message:users+"\n",time:new Date()})

    }
    else if (data.message =="!help"){
       
        await admin.firestore().collection("messages").add({username:"admin@admin.com",message:"Helpfull Commands\n"+help,time:new Date()})

    }
    else if (message.startsWith ("!weather")){
        const city = message.slice(9)
        const json = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=df457f0d839b8dedfee6eb5d1dd28827`)
        console.log(json);
        const des= json.weather[0].main
        const temp= json.main.temp
        const message2="The weather in  "+{city}+"is"+{des}+" and Temperature is "+{temp}
        await admin.firestore().collection("messages").add({username:"admin@admin.com",message:message2,time:new Date()})

    }
    return null
    
});

export const updateImage = functions.https.onRequest(async(req,res) => {
    //find all images(user with caption)
    let users =await admin.firestore().collection("users").where("caption",">","").get()
    let random = Math.floor(Math.random()* users.size)
    const result= await admin.firestore().collection("images").doc("user").update({email:users.docs[random].id,when:new Date()})
    console.log("Result:",result)
    res.status(200).send

})