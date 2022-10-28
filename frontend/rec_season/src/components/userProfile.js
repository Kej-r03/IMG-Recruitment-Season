import React, { useEffect } from "react";
import { MenuItem,AppBar, Grid,Paper,Link,createTheme,Divider,ThemeProvider,Menu, Box, Toolbar, Typography, IconButton, Avatar, TextField } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios";


const theme=createTheme({
    palette:{
        primary: {
            main:"rgb(30, 86, 125)",
        },
        secondary:{
            main:"rgb(255,255,255)",
        }
    },
})

axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken'
export default function ProfilePage(){

    const [user,setUser]=React.useState('')
    useEffect(()=>{
    axios
    .get("http://localhost:8000/img_member/info/",{withCredentials:true})
    .then(function(res)
    {
        setUser(res.data)
    })
},[])
    const [open,setOpen]=React.useState(false)
    const [anchorEl,setAnchorEl]=React.useState(null)
    const openMenu=(event)=>{
        setOpen(!open)
        setAnchorEl(event.currentTarget)
    }
    return(
        <ThemeProvider theme={theme}>
        <Box>
        <AppBar sx={{height:'6.5vh' }}>
            <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1,fontFamily:'cursive',fontSize:30  }} textAlign="center">
                User Profile
            </Typography>
            <IconButton variant="outlined" sx={{position:"absolute", right:"5vw ",}} color="secondary" onClick={openMenu}>
            <AccountCircleIcon  fontSize="large" />
            <Menu
                anchorEl={anchorEl}
                open={open}
            >
                    <MenuItem onClick={()=>{axios.get("http://localhost:8000/login/log_out/",{withCredentials:true});window.location.href=window.location.href;}}>Logout</MenuItem> 
            </Menu>
            </IconButton>
            </Toolbar> 
        </AppBar> 

        <Box>
            <Toolbar />
            <Grid container justifyContent="center">
            <Paper sx={{width:"45vw", m:"3vh"}} elevation={5}>
                <Toolbar>
                    <Grid container columnSpacing={2}>
                        <Grid item md={11}></Grid>
                        <Grid item><Link href="http://localhost:3000/onlogin/">Home</Link></Grid>
                    </Grid>
                </Toolbar>

                <Avatar variant="square" sx={{height:"25vh", width:"15vw", m:4, mb:"3vh",border:1}} src={require("./images/user.jpg")} />
                <Divider />

                <Box sx={{p:"4vh"}}>
                    <Box sx={{p:"2vh", mb:3}}>
                        <Typography sx={{fontWeight:"bold", fontSize:40,mb:1}}>
                            Name:
                        </Typography>
                        <Typography variant="h5">
                            {user.name}
                        </Typography>
                    </Box>
                    
                    <Box sx={{p:"2vh", mb:3}}>
                        <Typography sx={{fontWeight:"bold", fontSize:40,mb:1}}>
                            Enrolment No:
                        </Typography>
                        <Typography variant="h5">
                            {user.enrolment}
                        </Typography>
                    </Box>
                    
                    <Box sx={{p:"2vh", mb:3}}>
                        <Typography sx={{fontWeight:"bold", fontSize:40,mb:1}}>
                            Branch:
                        </Typography>
                        <Typography variant="h5">
                            {user.branch}
                        </Typography>
                    </Box>
                    
                    <Box sx={{p:"2vh", mb:3}}>
                        <Typography sx={{fontWeight:"bold", fontSize:40,mb:1}}>
                            Current Year:
                        </Typography>
                        <Typography variant="h5">
                            {user.current_year}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
            </Grid>
        </Box>

        </Box>
        </ThemeProvider>
    )
}