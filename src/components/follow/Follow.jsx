import React from "react";
import './Follow.css';

const Follow = () =>{
    const links = [
        {id:0, name:"LinkedIn", link:'https://www.linkedin.com', icon:'/linkedin_icon.webp', width:"24px", height:"24px" },
        {id:1, name:"Telegram", link:'https://www.telegram.com', icon:"/telegram.png", width:"24px", height:"24px" },
        {id:2, name:"Instagram", link:'https://www.instagram.com', icon:'/insta_icon.png', width:"24px", height:"24px"},
        {id:3, name:"TwitterX", link:'https://www.x.com', icon:"/twitter-x.png", width:"18px", height:"18px"},
        {id:4, name:"Facebook", link:'https://www.facebook.com', icon:"/fb_icon.png", width:"20px", height:"20px"},
        {id:5, name:"Youtube", link:'https://www.youtube.com', icon:'/youtube.png', width:"24px", height:"24px"},
    ];
    return(
        <div id="follow">
            <div id="links">
                <pre id="txt">Follow us on: </pre>
                {links.map(( l )=>(
                  <div key={l.id} className='element'><a href={l.link} rel='noreferrer' target='_blank'><img src={l.icon} width={l.width} height={l.height} alt={l.name}/></a></div>
                ))}
            </div>
        </div>
    );
}

export default Follow;