import React, {useState, useEffect} from 'react'
import axios from 'axios';
import './DetailList.css'

export default function Detail_Tram({trackObj}) {

    const [list, setList] = useState();

    const fetchDetail = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_CONNECTION_URL}vehicle/get/detail/${trackObj}`);
            // console.log(response.data);
            setList(response.data);
        } catch (error) {
            console.error('Error fetching VCollection:', error);
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
                <label style={{ color: "var(--white-color)" ,fontWeight:"700"}}>
                {list === undefined ? "NAME" : list.Name}
                </label>
            </div>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--gray-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="60px"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 15l3.5-3.5"></path> <path d="M20.3 18c.4-1 .7-2.2.7-3.4C21 9.8 17 6 12 6s-9 3.8-9 8.6c0 1.2.3 2.4.7 3.4"></path> </g></svg>
                <label>Speed&nbsp;&nbsp;</label>
                <label style={{ color: "var(--orange-color",fontWeight:"700"}}>{list === undefined ? "0" : list.Speed}</label>
                <label>&nbsp;&nbsp;km/h</label>
            </div>
            <div>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="60px"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7V12M8 8.99951C7.37209 9.83526 7 10.8742 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 10.8742 16.6279 9.83526 16 8.99951M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="var(--gray-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <label style={{ color: list === undefined ? "var(--black-color)" : list.active ? "#48db3d" : "#f23333" , fontWeight: "700" }}>{list === undefined ? "Unknown" : list.active ? 'Online' : 'Offline'}</label>
            </div>
        </div>
    )
}
