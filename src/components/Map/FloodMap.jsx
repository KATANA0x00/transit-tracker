import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

import BoatIcon from '../../assets/icons/boat.png';
import ClientIcon from '../../assets/icons/client-marker.png';

export default function FloodMap({ trackGroup, trackObj, clientLocation, setClientLocation, setHandleSelfTrack }) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyC2Va7mDBcmuCee_Y3thK4TrDq-RVPbNDI"
    });

    const mapRef = useRef(null);
    const [list, setList] = useState([]);
    const hasBoundsSet = useRef(false);

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setClientLocation({ lat: latitude, lng: longitude });
    }

    const fetchList = useCallback(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_CONNECTION_URL}Vehicle/get/position/${trackGroup}`);
            setList(response.data);
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
        if (mapRef.current && list.length > 0 && !hasBoundsSet.current) {
            const bounds = new window.google.maps.LatLngBounds();
            list.forEach((Item) => {
                bounds.extend(new window.google.maps.LatLng(Item.Position.lat, Item.Position.lng));
            });
            mapRef.current.fitBounds(bounds);
            mapRef.current.setZoom(18);
            hasBoundsSet.current = true;
        }
    }, [list]);

    useEffect(() => {
        if (mapRef !== null && trackObj) {
            trackObj && mapRef.current.setCenter(list.find((Item) => Item.ID === trackObj).Position);
            mapRef.current.setZoom(18);
        }
    }, [trackObj]);

    useEffect(() => {
        setHandleSelfTrack( () => () => {
            if (mapRef.current !== null && trackObj === null) {
                clientLocation && mapRef.current.setCenter(clientLocation);
                clientLocation && mapRef.current.setZoom(18);
            }
        });
    },[clientLocation]);

    if (!isLoaded || loadError) {
        return null;
    }

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100vw", height: "105vh" }}
            onLoad={map => {
                mapRef.current = map;
                map.setCenter({ lat: 13.727046907649072, lng: 100.77439265537033 });
            }}
            onUnmount={() => { mapRef.current = null; }}
            options={{
                disableDefaultUI: true,
                gestureHandling: 'greedy',
                maxZoom: 21
            }}
        >
            {
                list.map((Item) => (
                    <Marker
                        key={Item.ID}
                        position={{ lat: Item.Position.lat, lng: Item.Position.lng }}
                        icon={{
                            url: BoatIcon,
                            scaledSize: new window.google.maps.Size(48, 48),
                            anchor: new window.google.maps.Point(24, 24),
                            labelOrigin: new google.maps.Point(24, 53)
                        }}
                        label={{
                            text: Item.Name,
                            color: "black",
                            fontWeight: "700",
                            fontSize: "14px"
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
