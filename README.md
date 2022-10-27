![128x128](https://user-images.githubusercontent.com/70780576/153570079-4d8bb354-9993-4eea-ab89-b1d3f2bc3f8c.png)
# WebsocketOSC
Send and Recieve OSC via Websockets

Made for [cables.gl](cables.gl)
### [Download Here](https://github.com/jshea2/WebsocketOSC/releases)




## cables.gl Setup





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
