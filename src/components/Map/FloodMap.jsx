import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

import BoatIcon from '../../assets/icons/boat.png';

export default function FloodMap({ trackGroup, trackObj }) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyC2Va7mDBcmuCee_Y3thK4TrDq-RVPbNDI"
    });

    const mapRef = useRef(null);
    const [list, setList] = useState([]);
    const hasBoundsSet = useRef(false);

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
            hasBoundsSet.current = true;
        }
    }, [list]);

    useEffect(() => {
        if(mapRef !== null && trackObj){
            trackObj && mapRef.current.setCenter(list.find((Item) => Item.ID === trackObj).Position);
            mapRef.current.setZoom(18);
        }
    }, [trackObj]);

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
            onUnmount={() => { mapRef.current = null;}}
            options={{
                disableDefaultUI: true,
                gestureHandling: 'greedy',
                maxZoom: 18
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
        </GoogleMap>
    );
}
