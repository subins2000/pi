# Pi π

A Web Application to Find Value of Pi

## How It Works

The Pi value finding process is done in the server and it's results are given to the client using a WebSocket connection.

## What You Get From Here

client - The files of [http://demos.subinsb.com/pi](http://demos.subinsb.com/pi)

server - The files of WebSocket Server

## server

The server uses PHP & Python.

PHP is used for the WebSocket server. It uses [Ratchet PHP](http://socketo.me/) library for making the WebSocket server.

A Python script is used for finding the value of Pi. Thank You [Craig Wood](http://www.craig-wood.com/nick/articles/pi-chudnovsky/)

Remember to change the path of "pi.py" in "class.pi.php". By default it is "extra/pi.py" (Don't ask me why)
