const socket = io();
//console.log('hey');
if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=> {
        const {latitude, longitude} = position.coords;
        socket.emit('send-location', {latitude, longitude});
    },
    (error) => {
        console.error(error);
    },
    {
        enableHighAccuracy: true, 
        maximumAge: 0, 
        timeout: 5000
    }
);

}
const map = L.map("map").setView([0,0],16);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
   // maxZoom: 19,
    
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

const markers={};

socket.on('receive-location', (data) => {
    const {latitude, longitude, id} = data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
   
});

socket.on('user-disconnected', (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
