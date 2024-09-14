import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

import CarIcon from '../../assets/icons/golf.png';
import StationIcon from '../../assets/icons/stop-marker.png';
import ClientIcon from '../../assets/icons/client-marker.png';

export default function FloodMap({ trackGroup, trackObj, trackType, clientLocation, setClientLocation, setHandleSelfTrack }) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
    });

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const mapRef = useRef(null);
    const [listVehicle, setListVlehicle] = useState([]);
    const [listStation, setListStation] = useState([]);

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setClientLocation({ lat: latitude, lng: longitude });
    }

    const fetchList = useCallback(async () => {
        try {
            const response1 = await axios.get(`${import.meta.env.VITE_CONNECTION_URL}Vehicle/get/position/${trackGroup}`);
            setListVlehicle(response1.data);
            const response2 = await axios.get(`${import.meta.env.VITE_CONNECTION_URL}Station/get/position/${trackGroup}`);
            setListStation(response2.data);
        } catch (error) {
            console.error('Error fetching Position:', error);
        }
    }, [trackGroup]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchList();
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success);
            }
            
        }, 1000);
        return () => clearInterval(interval);
    }, [fetchList]);

    useEffect(() => {
        if (mapRef.current !== null && trackObj) {
            trackType === "Vehicle" ?
            mapRef.current.setCenter(listVehicle.find((Item) => Item.ID === trackObj).Position)
            :
            mapRef.current.setCenter(listStation.find((Item) => Item.ID === trackObj).Position)
            
            mapRef.current.setZoom(isDesktop ? 19 : 18);
        }
    }, [trackObj]);

    useEffect(() => {
        setHandleSelfTrack( () => () => {
            if (mapRef.current !== null && trackObj === null) {
                clientLocation && mapRef.current.setCenter(clientLocation);
                clientLocation && mapRef.current.setZoom(isDesktop ? 19 : 18);
            }
        });
    },[clientLocation]);

    if (!isLoaded || loadError) {
        return null;
    }

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100vw", height: "105vh" }}
            zoom={isDesktop ? 18 : 16}
            onLoad={map => {
                mapRef.current = map;
                map.setCenter({ lat: 13.726756988679465, lng: 100.77446799511423 });
            }}
            onUnmount={() => { mapRef.current = null; }}
            options={{
                disableDefaultUI: true,
                gestureHandling: 'greedy',
                maxZoom: isDesktop ? 21 : 18
            }}
        >
            {
                listVehicle.map((Item) => (
                    <Marker
                        key={Item.ID}
                        position={{ lat: Item.Position.lat, lng: Item.Position.lng }}
                        icon={{
                            url: CarIcon,
                            scaledSize: new window.google.maps.Size(48, 48),
                            anchor: new window.google.maps.Point(24, 24),
                            labelOrigin: new google.maps.Point(24, 58)
                        }}
                        label={{
                            text: Item.Name,
                            color: "black",
                            fontWeight: "700",
                            fontSize: "18px"
                        }}
                    />
                ))
            }
            {
                listStation.map((Item, idx) => (
                    <Marker
                        key={idx}
                        position={{ lat: Item.Position.lat, lng: Item.Position.lng }}
                        icon={{
                            url: StationIcon,
                            scaledSize: new window.google.maps.Size(42, 42),
                            anchor: new window.google.maps.Point(21, 42)
                        }}
                    />
                ))
            }
            {clientLocation && <Marker
                position={{ lat: clientLocation.lat, lng: clientLocation.lng }}
                icon={{
                    url: ClientIcon,
                    scaledSize: new window.google.maps.Size(42, 42),
                    anchor: new window.google.maps.Point(21, 42)
                }}
            />}
        </GoogleMap>
    );
}
