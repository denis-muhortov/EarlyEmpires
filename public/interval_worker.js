
let intervalId = 0;


function sendIntervalMessage(){
    postMessage({type: 'interval'});
}


onmessage = function(event) {
  let message = event.data;
  if(message.type == 'start'){
    intervalId = setInterval(
            sendIntervalMessage,
            message.interval);
  }else{
    clearInterval(intervalId);
  }
 };
