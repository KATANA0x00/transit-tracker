import React, { useState, useEffect } from 'react';
import './Detail.css';

import DetailListVehicle from './DetailList/Detail_Vehicle';
import DetailListStation from './DetailList/Detail_Station';

export default function Detail({trackObj, trackType}) {

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const [isRotated, setIsRotated] = useState(false);
    const [render, setRender] = useState(false);

    useEffect(() => {
        let timeout;
        if (!isRotated) {
            timeout = setTimeout(() => {
                setRender(false);
            }, 500);
        } else {
            setRender(true);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [isRotated]);

    return (
        <div className='Detail' style={
                isDesktop ? {
                        height : isRotated ? '427px' : '40px',
                        width : isRotated ? '28%' : '7%' ,
                        borderRadius : isRotated ? '25px' : '35px' ,
                        right : isRotated ? '7%' : '18%' ,
                    }
                :{ transform: `translateY(${isRotated ? 0 : "300px"})` }
            }>
            <button
                style={{marginBottom: `${isRotated ? '0' : '22px'}`}}
                onClick={() => { setIsRotated(!isRotated); setIsDesktop(window.innerWidth >= 1024); }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="48px"
                    height="48px"
                    style={{ transform: `rotate(${isRotated ? 180 : 0 }deg)`, transition: 'transform 0.3s ease', height: '37px' }}
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="M18.2929 15.2893C18.6834 14.8988 18.6834 14.2656 18.2929 13.8751L13.4007 8.98766C12.6195 8.20726 11.3537 8.20757 10.5729 8.98835L5.68257 13.8787C5.29205 14.2692 5.29205 14.9024 5.68257 15.2929C6.0731 15.6835 6.70626 15.6835 7.09679 15.2929L11.2824 11.1073C11.673 10.7168 12.3061 10.7168 12.6966 11.1073L16.8787 15.2893C17.2692 15.6798 17.9024 15.6798 18.2929 15.2893Z"
                            fill="var(--orange-color)"
                        ></path>
                    </g>
                </svg>
            </button>

            {trackType === "Vehicle" && render && <DetailListVehicle trackObj={trackObj}/>}
            {trackType === "Station" && render && <DetailListStation trackObj={trackObj}/>}
            {/* {isRotated && <div></div>} */}
        </div>
    )
}
