/* ==========================================================================
   main.js
   ========================================================================== */
var $j = jQuery.noConflict();

$j(function(){

  var smsLength = 0;
  var user = "";
  //
  // var xhttp = new XMLHttpRequest();
	// xhttp.open("GET","model/user.json",false);
	//  xhttp.send();
	 var model =  { "users": [
   	{"phone":"08069537135","tariff":"bounce","balance":300.0},
   	{"phone":"08115556660","tariff":"infinito","balance":20.0},
   	{"phone":"08115556666","tariff":"bumpa","balance":0.11},
   	{"phone":"08115556667","tariff":"bounce","balance":1000.0},
    {"phone":"9","tariff":"bounce","balance":10.0}
       ],


    "tariff":{"bounce":15,"infinito":11,"bumper":50,"gbam":11}

   }


	 console.log(model);
	 console.log(model.tariff.bounce);

	$j("#numberModal").modal("show");

	$j("#numberBtn").click(function(){
     var userNumber = $j("#numberInput").val();
       for( u in model.users){
         if(model.users[u].phone == userNumber){
             user = model.users[u];
             updateUserStuffs();
            //  setTariffs();
         		 $j("#numberModal").modal("hide");
           }
       }
      //$J() set login error
		});

	$j("#rechargeBtn").click(function(){
    console.log("recharging...");
    if($j("#rechargeSerial").val() > 10000 ){
      user.balance = parseFloat(user.balance)+[100,200,400,500,1000][Math.floor( (Math.random()*10)%5 )];
      console.log("recharging..."+user.balance);
      updateUserStuffs();
      var notice = "your recharge was successful &nbs; new acc balance is <br/> main : NGN "+user.balance;
      setNotification(notice);
  		$j("#rechargeModal").modal("hide");
    }
    //set serial error
	});


  // $J("#tariffModal").click(function(){
  //
  // });

  //
  function setTariffs(){
    var trf = model.tariff;
    console.log(trf);
    for(i in trf){
      console.log(i);
      $j(".changeTariff").append($j('<input>',{
                                          type: "radio",
                                          name:"tariff",
                                          value:i,
                                          html: i + " : "+trf[i]+"k/s"
                                      })).append($j('<br>'));
      }
    }

  //
  function updateUserStuffs(){
    $j(".userNumber").html(user.phone);
    $j(".userBalance").html(user.balance);
    var trf = user.tariff +" @ "+ model.tariff[user.tariff]+"k/s";
    $j(".userTariff").html(trf);
  }

  //
  function setNotification(notice){
    $j(".notification").html(notice);
    $j("#noticeModal").modal('show');
  }



  $j("#smsContent").change(function(){
    smsLength = Math.floor($j("#smsContent").val().length % 100)+1;
    $j("#smsLength").val(smsLength);
  });

	// $j("#userNumber").html();

$j("#smsBtn").click(function(e){
  if($j("#smsSendAddr").val() != ""){
    if(user.balance >= 4){
      user.balance -= 4;
      updateUserStuffs();
      $j("#msgModal").modal('hide');
      setNotification("mesage sent");
    }else
      alert("insufficient fund");
  }
  e.preventDefault();
});

var callTimerVar = 0;

//activate call functions
$j("#makeCall").click(function(){
  $j("#keypardModal").modal('hide');
  user.balance*100 < model.tariff[user.tariff]? setNotification("Insufficient Fund") : function(){
                $j("#activeCallModal").modal('show');
                callTimerVar = setInterval(callTimer,1000);
              }();
});

//deactivate call functions
$j("#activecall").click(function(){
  $j("#activeCallModal").modal('hide');
  endCall();
});

//call timind
  function callTimer(){
    console.log("starting call....");
    user.balance*100 < model.tariff[user.tariff] ? endCall() : function(){
      console.log("call ongoing...");
      callTime();
      duration+=1;
      console.log(user.balance);
      user.balance = (user.balance -model.tariff[user.tariff]/100).toFixed(2); //billing
      console.log(user.balance);
      updateUserStuffs();
    }();

  }

var duration = 0

//display call duration
function callTime(){
    var d = Math.floor(duration/3600) +":"+ Math.floor((duration%3600)/60) +":"+ ((duration%3600)%60);
    $j("#duration").html(d);
  }

//terminate call
function endCall(){
  console.log("clearing interval ... ");
  clearInterval(callTimerVar);
  $j("#activeCallModal").modal('hide');
  var msg = "your last call was "+ duration +"sec your acc balance is NGN "+user.balance;
  duration = 0;
  setNotification(msg);

}

//Dial pard
    var dials = $j(".dials ol li");
    var index;
    var number = $j(".number");
    var total;

    dials.click(function(){

        index = dials.index(this);

        if(index == 9){

            number.append("*");

        }else if(index == 10){

            number.append("0");

        }else if(index == 11){

            number.append("#");

        }else if(index == 12){

            number.empty();

        }else if(index == 13){

            total = number.text();
            total = total.slice(0,-1);
            number.empty().append(total);

        }else if(index == 14){

            //add any call action here

        }else{ number.append(index+1); }
    }); //end dial

    //Using number keypard
    $j(document).keydown(function(e){
      var backSpace = false;
        switch(e.which){

            case 96:

                number.append("0");
                break;

            case 97:

                number.append("1");
                break;

            case 98:

                number.append("2");
                break;

            case 99:

                number.append("3");
                break;

            case 100:

                number.append("4");
                break;

            case 101:

                number.append("5");
                break;

            case 102:

                number.append("6");
                break;

            case 103:

                number.append("7");
                break;

            case 104:

                number.append("8");
                break;

            case 105:

                number.append("9");
                break;

            case 8:

                total = number.text();
                total = total.slice(0,-1);
                number.empty().append(total);
                backSpace = true;
                break;

            case 27:

                number.empty();
                break;

            case 106:

                number.append("*");
                break;

            case 35:

                number.append("#");
                break;

            case 13:

                $j('.pad-action').click();
                break;

            default: return;
        }

       backSpace ? "":  e.preventDefault();
    });




});
