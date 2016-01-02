<?php
$digits = 8;
?>
<!DOCTYPE html>
<html>
  <head>
    <script src="//lab.subinsb.com/projects/jquery/core/jquery-2.1.1.js"></script>
    <script src="js/pi.js"></script>
    <link href="css/pi.css" rel="stylesheet" />
  </head>
  <body>
    <div id="content" class="find-pi">
      <h2>Finding The Value of Pi</h2>
      <p>
        <a href="//demos.sim/pi/values.php" class="btn green">See Digits Already Found</a>
      </p>
      <div class="controls">
        <a class="btn blue" id="connect">Connect To Server</a>
        <a class="btn red disabled" id="getStatus">Get Latest Status</a>
        <a class="btn red disabled" id="getPi">Get Pi's Value</a>
      </div>
      <div class="status-header">Server Status</div>
      <div class="status" id="server-status"></div>
      <div class="status-header">Pi Status</div>
      <p>The status is updated every 3 seconds.</p>
      <div class="pi-info">
        <div class="status" id="pi-status"></div>
        <div id="iteration-counter" class="counter">
          <p>Iteration Counter*</p>
          <?php
          for($i = $digits;$i >= 0;$i--){
            echo "<div class='count-box' id='c$i'>0</div>";
          }
          ?>
        </div>
        <div id="pi-counter" class="counter" title="Number of Pi values found">
          <p>Pi Value Counter**</p>
          <?php
          for($i = $digits;$i >= 0;$i--){
            echo "<div class='count-box' id='c$i'>0</div>";
          }
          ?>
        </div>
      </div>
      <p>* - Greater the iteration, accurate the value</p>
      <p>** - Approximation. Maybe inaccurate for smaller digits</p>
      <div class="pi-value">
        <h2>Value of Pi</h2>
        <div id="pi-value" class="status"></div>
      </div>
    </div>
  </body>
</html>
