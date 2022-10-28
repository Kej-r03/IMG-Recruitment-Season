import React from "react";
import { Menu,MenuItem,IconButton } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios";

export default function Account(){
    const [open,setOpen]=React.useState(false)
    const [anchorEl,setAnchorEl]=React.useState(null)
    const openMenu=(event)=>{
        setOpen(!open)
        setAnchorEl(event.currentTarget)
    }

    return(
        <IconButton variant="outlined" sx={{position:"absolute", right:"5vw ",}} color="secondary" onClick={openMenu}>
                <AccountCircleIcon  fontSize="large" />
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                >
                    <MenuItem onClick={()=>{window.location.href="http://localhost:3000/profile/"}}>Profile</MenuItem>
                    <MenuItem onClick={()=>{axios.get("http://localhost:8000/login/log_out/",{withCredentials:true});window.location.href=window.location.href;}}>Logout</MenuItem> 
                </Menu>
                </IconButton>
    )
}