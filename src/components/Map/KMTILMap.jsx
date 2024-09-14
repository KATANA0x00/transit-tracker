import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

import CarIcon from '../../assets/icons/golf.png';
import StationIcon from '../../assets/icons/stop-marker.png';

export default function FloodMap({ trackGroup, trackObj, trackType }) {

    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
    });

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const mapRef = useRef(null);
    const [listVehicle, setListVlehicle] = useState([]);
    const [listStation, setListStation] = useState([]);

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
        }, 1000);
        return () => clearInterval(interval);
    }, [fetchList]);

    useEffect(() => {
        if (mapRef !== null && trackObj) {
            trackType === "Vehicle" ?
                trackObj && mapRef.current.setCenter(listVehicle.find((Item) => Item.ID === trackObj).Position) :
                trackObj && mapRef.current.setCenter(listStation.find((Item) => Item.ID === trackObj).Position)
            mapRef.current.setZoom(isDesktop ? 19 : 18);
        }
    }, [trackObj]);

    if (!isLoaded || loadError) {
        return null;
    }

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100vw", height: "105vh" }}
            zoom={isDesktop ? 18 : 16}
            onLoad={map => {
                mapRef.current = map;
                map.setCenter({ lat: 13.726756988679465, lng: 100.77426799511423 });
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
        </GoogleMap>
    );
}
