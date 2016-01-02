window.pi = {
  
  /**
   * Output status
   */
  out: function(msg){
    $(".find-pi #server-status").html(msg);
  },
  
  /**
   * Make the values of counter to 0
   */
  clear: function(){
    for(i=0;i <= $(".find-pi .count-box").length / 2;i++){
      $(".find-pi .count-box#c" + i).text("0");
    }
  },
  
  init: function(){
    this.out("Connecting to server...");
    this.clear();
    if(this.ws){
      this.ws.close();
    }
    this.ws = new WebSocket("ws://demos.sim:8000/?service=pi");
    this.ws.onopen = function(){
      pi.out("Connected to server");
      $(".find-pi .disabled.btn").removeClass("disabled");
      pi.getPiStatus();
    };
    this.ws.onclose = function(){
      pi.out("Connection to server failed. Probably because : <ol><li>Your Browser/Internet Connection Problem (:P)</li><li>The server was overloaded</li><li>Server is affected by a headache because of calculating Pi</li></ol>Get Subin, and make him fix this. RIGHT NOW !");
      $(".find-pi").find("#getStatus, #getPi").addClass("disabled");
    };
    this.ws.onmessage = function(msg){
      msg_data = JSON.parse(msg.data);
      data = msg_data.data;
      if(msg_data.type == "status"){
        what = data.status[0];
        
        if(what == "init"){
          $(".find-pi #pi-status").html("Initialization Step <b>"  + data.status[1] + "</b>");
        }else if(what == "sqrt"){
          $(".find-pi #pi-status").html("Calculating Square Root");
          val = data.status[1];
          val_len = val.length - 1;
          for(i=0;i <= val_len;i++){
            $(".find-pi #iteration-counter .count-box#c" + i).text(val[val_len - i]).addClass("val-changed");
          }
        }else if(what == "pi"){
          $(".find-pi #pi-status").html("Calculating Pi. Target : <b>" + data.status[3] + "</b> digits");
          /**
           * Iterations
           */
          val = data.status[1];
          val_len = val.length - 1;
          for(i=0;i <= val_len;i++){
            $(".find-pi #iteration-counter .count-box#c" + i).text(val[val_len - i]).addClass("val-changed");
          }
          /**
           * No of Pi digits
           */
          val = data.status[2];
          val_len = val.length - 1;
          for(i=0;i <= val_len;i++){
            $(".find-pi #pi-counter .count-box#c" + i).text(val[val_len - i]).addClass("val-changed");
          }
        }
      }else if(msg_data.type == "pi"){
        $(".find-pi .pi-value").fadeIn("2000");
        $('html, body').animate({
          scrollTop: $(".find-pi .pi-value").offset().top
        }, 500);
        if(data == "running"){
          $(".find-pi #pi-value").html("Process Currently running. Please wait until it ends...");
        }else{
          $(".find-pi #pi-value").html(data);
        }
      }else if(msg_data.type == "ended"){
        /**
         * Pi's values was found
         */
        clearInterval(pi.checkInterval);
        $(".find-pi #pi-status").html("Pi Calculation Finished <a id='calculatePi' class='btn orange'>Calculate Pi Again</a>");
      }else if(msg_data.type == "invalid_digits"){
        $(".find-pi #pi-status").html("<h3>Invalid Digit</h3><p>Digit must be a positive integer greater than 5 and less than 1 Million (1,000,000)</p>");
      }else if(msg_data.type == "running_as_per_user_request"){
        pi.init();
      }else if(msg_data.type == "not_allowed"){
        $(".find-pi #pi-status").html("<h3>Forbidden</h3><p>Users are revoked from access to run Pi calculation. It may be allowed later. Contact Subin if you really want to run it</p>");
      }
    };
  },
  
  getPiStatus: function(){
    pi.ws.send("status");
    pi.checkInterval = setInterval(function(){
      pi.ws.send("status");
    }, 3000);
  },
  
  getPi: function(){
    this.ws.send("pi");
  }
}

$(function(){
  pi.init();
  
  $(".find-pi #connect").on("click", function(){
    pi.init();
  });
  $(".find-pi #getStatus").on("click", function(){
    if(!$(this).hasClass("disabled")){
      pi.ws.send("status");
    }
  });
  $(".find-pi #getPi").on("click", function(){
    if(!$(this).hasClass("disabled")){
      pi.getPi();
    }
  });
  $(document).on("click", ".find-pi #calculatePi", function(){
    var digits = prompt("Digits to be calculated");
    pi.ws.send("run," + digits);
  });
});
