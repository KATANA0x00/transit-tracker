import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './TrackModal.css'

export default function TrackModal({ trackObj, setTrackObj, setIsPopup, trackType, setTrackType, trackGroup, enableStation }) {

    const [select, setSelect] = useState(trackObj);
    const [list, setList] = useState();

    const fetchCollection = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_CONNECTION_URL}${trackType}/get/collection/${trackGroup}`);
            // console.log(response.data);
            setList(response.data);
        } catch (error) {
            console.error('Error fetching VCollection:', error);
        }
    }

    useEffect(() => {
        if (list === undefined) {
            fetchCollection();
        }
    },[list])

    useEffect(() => {
        fetchCollection();
    },[trackType])

    return (
        <>
            <div className='Track'
                onClick={() => { setIsPopup(false) }}
            >
            </div>
            <div className='TrackModal'>
                <div className='fillGap'></div>
                <div className='SelectFilter'>
                    <button
                        style={{
                            color: `${trackType == "Vehicle" ? "var(--orange-color)" : "var(--gray-color)"}`,
                            backgroundColor: `${trackType == "Vehicle" ? "#EEEEEE" : "#D8D8D8"}`,
                            borderBottomRightRadius: `${enableStation ? '20px' : '0'}`,
                            width: `${enableStation ? '50%' : '100%'}`
                        }}
                        onClick={() => { setTrackType("Vehicle") }}
                    >Vehicle</button>
                    { enableStation && <button
                        style={{
                            color: `${trackType == "Station" ? "var(--orange-color)" : "var(--gray-color)"}`,
                            backgroundColor: `${trackType == "Station" ? "#EEEEEE" : "#D8D8D8"}`,
                            borderBottomLeftRadius: "20px",
                        }}
                        onClick={() => { setTrackType("Station") }}
                    >Station</button>}
                </div>
                <div className='SelectBody'>
                    <div className='Selector'>
                        <div>
                        {   list &&
                            list.map((Item) => (
                                <button
                                    className='SelectorList'
                                    onClick={() => {setSelect(Item.ID)}}
                                    style={{
                                        backgroundColor: select === Item.ID ? 'var(--orange-color)' : '#D8D8D8',
                                        color: select === Item.ID ? 'var(--white-color)' : 'var(--gray-color)'
                                        }}
                                    key={Item.ID}
                                >{Item.Name}</button>
                            ))
                        }
                        </div>
                    </div>
                    <div className='SelectorBtn'>
                        <button
                            onClick={() => { setIsPopup(false); setTrackObj(null) }}
                        >
                            CLEAR
                        </button>
                        <button
                            onClick={() => { setIsPopup(false); setTrackObj(select) }}
                        >GO!</button>

                    </div>

                </div>
            </div>
        </>

    )
}
