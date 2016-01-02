<!DOCTYPE html>
<html>
  <head>
    <title>Values</title>
  </head>
  <body>
    <div id="content" class="find-pi">
      <h2>Finding The Value of Pi</h2>
      <p>Digits are counted after the decimal point</p>
      <center>
        <a class="btn blue" href="?digits=thousand">Thousand Digits</a>
        <a class="btn green" href="?digits=1million">1 Million Digits (10,00,000)</a><br/><br/>
        <a class="btn red" href="?digits=5million">5 Million Digits (50,00,000)</a>
      </center>
      <?php
      if(isset($_GET['digits'])){
        $digits = $_GET['digits'];
        if($digits === "5million"){
          $pi = file_get_contents(__DIR__ . "/values/5million.txt");
          echo "<pre style='white-space:pre;word-wrap: break-word;max-width:600px;border: 2px dashed #000;padding: 10px;'><code>". $pi ."</code></pre>";
        }
        if($digits === "1million"){
          $pi = file_get_contents(__DIR__ . "/values/1million.txt");
          echo "<pre style='white-space:pre;word-wrap: break-word;max-width:600px;border: 2px dashed #000;padding: 10px;'><code>". $pi ."</code></pre>";
        }
        if($digits === "thousand"){
          $pi = file_get_contents(__DIR__ . "/values/thousand.txt");
          echo "<pre style='white-space:pre;word-wrap: break-word;max-width:600px;border: 2px dashed #000;padding: 10px;'><code>". $pi ."</code></pre>";
        }
      }
      ?>
    </div>
  </body>
</html>
