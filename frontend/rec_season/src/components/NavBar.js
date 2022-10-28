import { ButtonGroup, Button,Toolbar,Link } from "@mui/material";
import React from "react";

export default function NavBar(props){
    const {id}=props
    return(
        <>
        <div  style={{position:'absolute',left:'75vw',top:'8vh'}}>
            {/* <ButtonGroup variant="outlined" size="large"> */}
                <Button onClick={()=>{window.location.href="http://localhost:3000/onlogin/"}}>Home</Button>
                <Button onClick={()=>{window.location.href="http://localhost:3000/dashboard/"+id+"/"}}>Dashboard</Button>
                <Button onClick={()=>{window.location.href="http://localhost:3000/candidates/"+id+"/"}}>Candidate List</Button>
                <Button onClick={()=>{window.location.href="http://localhost:3000/test/"+id+"/"}}>Rounds</Button>
            {/* </ButtonGroup> */}
        </div>
        </>
    )
}