import * as React from 'react';
import ReactPlayer from "react-player";


class Information extends React.Component{
    render(){
        return(
            <div id="info">
                <p>Pixels is inspired by the <a href="https://www.reddit.com/r/place/">/r/place</a> subreddit. 
                To get started select a pixel on the canvas and select a colour and press confirm. Now your edit is visible to everyone!</p>
                <ReactPlayer url="https://www.youtube.com/watch?v=XnRCZK3KjUY&t=1s" width="auto"></ReactPlayer>
            </div>
        )
    }

}

export default Information
