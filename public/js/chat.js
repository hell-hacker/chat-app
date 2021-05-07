const socket=io();
var count=0;
function getTime(){
     var d = new Date();
     var h = d.getHours();
     var m = d.getMinutes();
     var format=' AM';
     if(h>12)
     {
          h-=12;
          format=' PM';
     }
     if(h<10)
     h='0'+h;
     if(m<10)
     m='0'+m;
     var time=h+':'+m+format;
     return time;
}
function is_url(str)
{
  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str))
        {
          return true;
        }
        else
        {
          return false;
        }
}
$messages=document.querySelector('#message1');
$inputBox=document.querySelector('#inputBox');

document.getElementById('message1').style.height=window.innerHeight-134+"px";
console.log(document.getElementById('message1').style.height);
const autoscroll=()=>{
     
     const $newMessage= $messages.lastElementChild;
     
      const inputbox=$inputBox.offsetTop;
      const totalheight=$newMessage.offsetHeight+$newMessage.offsetTop;
      if(totalheight+20>inputbox){
           $messages.scrollTop=totalheight-(inputbox-20);
           console.log(totalheight-(inputbox-20));
       }
      console.log(inputbox+" "+totalheight+" "+ $messages.scrollTop);
      /*const newMessageStyles=getComputedStyle($newMessage);
      console.log(newMessageStyles);
      const newMessageMargin=parseInt(newMessageStyles.marginBottom);
      const newMessageHeight=$newMessage.offsetHeight+newMessageMargin;

      const visibleHeight=$messages.offsetHeight;

      const containerHeight=$messages.scrollHeight;
      const scrollOffset=$messages.scrollTop+visibleHeight;
      
      if(containerHeight-newMessageHeight<=scrollOffset)
      {
           $messages.scrollTop=$messages.scrollHeight;
      }*/
    //  console.log($messages.scrollTop);
}
function List(){
          socket.emit('userslist',(userlist)=>{
                         console.log(userlist);    
                         document.getElementById('list').innerHTML=''; 
               for(var i=0;i<userlist.length;i++){
                    let usersTemplate=document.getElementById('user-list-template').innerHTML;    
                    
                    const html=Mustache.render(usersTemplate,{
                         username:userlist[i]['username']
                    });
                   document.getElementById('list').insertAdjacentHTML('beforeend',html);
               }
          })
          document.getElementById('userlist').style.display='block';
}
function Close(){
     document.getElementById('userlist').style.display='none';

}
socket.on('sendMessage',(message='welcome',username)=>{
     console.log(username);
     
        let messageTemplate=document.getElementById('message-template').innerHTML;    
        
          const html=Mustache.render(messageTemplate,{
               message:message,
               time:getTime(),
               username:username
          });
      
     document.getElementById('message1').insertAdjacentHTML('beforeend',html);
     if(username=='You'){
          document.getElementsByClassName('messages')[count].style.float='right';
          document.getElementsByClassName('messages')[count].style.background='linear-gradient( 90deg , #b12056,#1d1d50)';
     }
     count++;
     autoscroll();
     // console.log(document.getElementById('message'));
})

socket.on('sendLocation',(url,username)=>{
     let locationTemplate=document.getElementById('location-template').innerHTML;   
     console.log(url);
     var username1;
     if(username!='You')
     username1=username;
     else
     username1='';
     const html=Mustache.render(locationTemplate,{username1:username1,username:username,url:url,time:getTime()});
     document.getElementById('message1').insertAdjacentHTML('beforeend',html);   
     if(username=='You'){
          document.getElementsByClassName('messages')[count].style.float='right';
          document.getElementsByClassName('messages')[count].style.background='linear-gradient( 90deg , #b12056,#1d1d50)';
     }
     count++; 
     autoscroll();
     // console.log(document.getElementById('message'));                 
})

const params = new URLSearchParams(window.location.search)
    if(params.has('room'))
    { 
         //console.log(params.get('room'));
         var p=params.get('room');
         var v=params.get('username');
            v.trim();
            var k=v.indexOf(" ");
            if(k==-1)
            k=10;
             var v1=v.substring(0,k);
     socket.emit('join',v1,p);
     
    }

function send(){  
      
      document.getElementById('send').setAttribute('disabled','disabled');
    
      let value=document.getElementById('b1').value;
      socket.emit('requestMessage',value,(confirmMessage)=>{
          console.log(confirmMessage);
          document.getElementById('send').removeAttribute('disabled');
          //document.getElementById('b1').focus();
          document.getElementById('b1').value='';
     });
}
function sendLocation(){
     document.getElementById('sendLocation').removeAttribute('disabled','disabled');
        if(!navigator.geolocation){
            return alert("Unable to fetch location");
        }
      
         navigator.geolocation.getCurrentPosition((position)=>{
                
            let latitude=position.coords.latitude;
           let longitude=position.coords.longitude;
            socket.emit('requestLocation',`https://google.com/maps?q=${latitude},${longitude}`,(confirmMessage)=>{
                console.log(confirmMessage);
                document.getElementById('sendLocation').removeAttribute('disabled');
                document.getElementById('b1').focus();
            });
         })     
}
//  function fun(){
//      let value=document.getElementById('b1').value;
//      console.log(value);
//      socket.emit('request',value);
//  }
