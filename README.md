![128x128](https://user-images.githubusercontent.com/70780576/198192975-0566f616-64e9-49d2-ae14-74e4e7bb0574.png)

# WebsocketOSC
Send and Recieve OSC via Websockets

Made for [cables.gl](cables.gl)
### [Download Here](https://github.com/jshea2/WebsocketOSC/releases)

<img width="421" alt="Screen Shot 2022-10-26 at 8 46 42 PM" src="https://user-images.githubusercontent.com/70780576/198193033-a9c5f42b-6dba-4a1d-b6f7-7d033230121e.png">



## cables.gl Setup


<img width="252" alt="Screen Shot 2022-10-26 at 9 35 14 PM" src="https://user-images.githubusercontent.com/70780576/198193040-c698a37e-b83e-4d27-aea5-a9e13a7552bb.png">



## OSC to Websocket syntax

OSC Message:

`/foo` `1234`


Websocket Message:

```
{
  "v": [1234],
  "a": "/foo"
}
```




# Credits:
Inspired by [osc2ws](https://github.com/pandrr/osc2ws). This does the same just as a standalone app.
