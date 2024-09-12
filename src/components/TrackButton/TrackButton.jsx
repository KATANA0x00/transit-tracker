import React, {useEffect, useState} from 'react'
import axios from 'axios';
import './TrackButton.css'

import TrackModal from '../TrackModal/TrackModal'

export default function TrackButton({trackObj, setTrackObj, trackType, setTrackType, trackGroup, enableStation}) {

    const [isPopup, setIsPopup] = useState(false);
    const [name, setName] = useState('SELECT');

    const fetchName = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/${trackType}/get/name/${trackObj}`);
            // console.log(response.data.Name);
            setName(response.data.Name);
        } catch (error) {
            console.error('Error fetching name:', error);
        }
    }

    function handleSelect() {
        setIsPopup(!isPopup);
    }

    function handleSelf() {
        setTrackObj(null);
    }

    useEffect(() => {
        if(trackObj !== null){
            fetchName()
        }
    },[trackObj])

    return (
        <>
        <div className='TrackBtn'>
            <button 
                style={{ flexGrow: 1, backgroundColor: `${trackObj === null ? 'var(--white-color)' : 'var(--orange-color)' }`, color: `${trackObj === null ? 'var(--gray-color)' : 'var(--white-color)' }` }}
                onClick={handleSelect}
                disabled={trackGroup === null}
            >
            {trackObj === null ? "SELECT": name}
            </button>
            <button
                style={{ flexShrink: 0, padding: "10px 15px", backgroundColor: `${trackObj === null ? 'var(--orange-color)' : 'var(--white-color)' }` }}
                onClick={handleSelf}
                disabled={trackGroup === null}

            >
                <svg
                    viewBox="2 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: 'rotate(-45deg)', width: '50px', height: '50px' }}
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M12.0004 18.5816V12.5M12.7976 18.754L15.8103 19.7625C17.4511 20.3118 18.2714 20.5864 18.7773 20.3893C19.2166 20.2182 19.5499 19.8505 19.6771 19.3965C19.8236 18.8737 19.4699 18.0843 18.7624 16.5053L14.2198 6.36709C13.5279 4.82299 13.182 4.05094 12.7001 3.81172C12.2814 3.60388 11.7898 3.60309 11.3705 3.80958C10.8878 4.04726 10.5394 4.8182 9.84259 6.36006L5.25633 16.5082C4.54325 18.086 4.18671 18.875 4.33169 19.3983C4.4576 19.8528 4.78992 20.2216 5.22888 20.394C5.73435 20.5926 6.55603 20.3198 8.19939 19.7744L11.2797 18.752C11.5614 18.6585 11.7023 18.6117 11.8464 18.5933C11.9742 18.5769 12.1036 18.5771 12.2314 18.5938C12.3754 18.6126 12.5162 18.6597 12.7976 18.754Z"
                            stroke= {trackObj === null ? 'var(--white-color)' : 'var(--gray-color)'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                    </g>
                </svg>
            </button>
        </div>
        {isPopup && <TrackModal setIsPopup={setIsPopup} trackObj={trackObj} setTrackObj={setTrackObj} trackType={trackType} setTrackType={setTrackType} trackGroup={trackGroup} enableStation={enableStation}/>}
        </>
    )
}
