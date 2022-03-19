import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import {getRatio} from "./services"


function App(){
    const [text, setText] = useState("");
    const [ratioText, setRatioText] = useState("");

    function searchTweets(){
        //const inputUser = client.v2.userByUsername(text).then((response) => {console.log(response.data)})
        getRatio(text).then((response) => {setRatioText(response.ratio)})
    }
    
    return(
        <div>
            <p>
                <TextField
                    value={text}
                    id="username-input"
                    label="Twitter Handle"
                    onChange={(e) => {setText(e.target.value)}}
                />
            </p>
            <p>
                <Button onClick={() => searchTweets()}>
                    Search Tweets
                </Button>
            </p>
            <h1>
                {ratioText}
            </h1>
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)
//export default App;