import React, {useState, useEffect} from 'react'
import axios from 'axios';
import './DetailList.css'

import DefaultImg from '../../../assets/img/default.png'

export default function Detail_Tram({ trackObj }) {

    const [list, setList] = useState();

    const fetchDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/station/get/detail/${trackObj}`);
            // console.log(response.data);
            setList(response.data);
        } catch (error) {
            console.error('Error fetching SCollection:', error);
        }
    }

    useEffect(() => {
        if (trackObj !== null) {
            const intervalId = setInterval(() => {
                fetchDetail();
            }, 1000);
    
            return () => clearInterval(intervalId);
        }
    }, [trackObj]);

    return (
        <div className='DetailList'>
            <div style={{ margin: "0 20px", padding: "8px 35px", backgroundColor: "var(--orange-color)", borderRadius: "40px", width: "fit-content",maxWidth: "90%",boxSizing:"border-box" }}>
                <label style={{ color: "var(--white-color)", fontWeight: "700" }}>
                {list === undefined ? "NAME" : list.Name}
                </label>
            </div>
            <div className='imgContainer'>
                <img
                    src={list === undefined ? DefaultImg : list.ImgUrl === null ? DefaultImg : list.ImgUrl}
                />
            </div>
        </div>
    )
}
