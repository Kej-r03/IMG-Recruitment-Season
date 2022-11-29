# import json

# from channels.generic.websocket import WebsocketConsumer
# from channels.consumer import AsyncConsumer

# class IMGConsumer(AsyncConsumer):
#     async def websocket_connect(self,event):
#         print("Connected")
#         print(self.channel_name)
#         print("Connected again")
#         self.send({'type':'websocket.accept',})
    
#     def websocket_receive(self,event):
#         print("Received",event)
#         self.send({'type':'websocket.send',
#         'text':'from server',})
    
#     def websocket_accept(self,event):
#         print("ACCepted")
    
#     def websocket_disconnect(self,event):
#         print("DIsonnected",event)

import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        
        await self.channel_layer.group_add(
            "IMG", self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
       await self.channel_layer.group_discard(
            "IMG", self.channel_name
        )

    async def receive(self, text_data):
        message = json.loads(text_data)
        message = message["message"]

        await self.channel_layer.group_send(
            "IMG", {"type":"update_all","message": message}
        )

    async def update_all(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message}))