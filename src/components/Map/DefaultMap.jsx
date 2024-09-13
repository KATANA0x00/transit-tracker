import React,{useState} from 'react'
import MapPicture from '../../assets/img/DefaultMap.jpg'
import WaterMark from '../../assets/img/DefaultMapWaterMark.png'

export default function DefaultMap() {

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    return (
        <>
            <div style={{position: "absolute", width: "100%",height: "100vh", backgroundColor: "rgb(100, 100, 100, 0.5)"}}></div>
            <img src={WaterMark} style={{ width: isDesktop ? "30%" : "100%", position: "absolute", left: "50%", transform: "translate(-50%, -5%)"}} />
            <img src={MapPicture} style={{ width: "100%" }} />
            
        </>

    )
}