import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
axios.defaults.withCredentials = true;
export default function Form(){

    const [selectedFile, setSelectedFile] = React.useState();
    const changeHandler=(event)=>{
        setSelectedFile(event.target.files[0])
    }
    const uploadFile=()=>{
        const formData=new FormData()
        formData.append('File', selectedFile)
        const url='http://localhost:8000/candidate_season_data/create_from_csv/';
        axios
        .post(url,formData,{headers:{'Content-Type': 'multipart/form-data'}})
        window.location.href=window.location.href
    }
    

    return(<div style={{position:'absolute', left:'75vw',top:'20vh',}}>
        <input type="file" onChange={changeHandler}></input>
        <Button variant="contained" onClick={uploadFile} sx={{position:'relative', right:'4vw'}}>Upload CSV</Button>
        </div>
    )
}