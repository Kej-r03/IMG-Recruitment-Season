import React from "react";
import { createTheme } from '@mui/material/styles'
import List from '@material-ui/core/List';
import { ListItem } from "@material-ui/core";
import { AppBar, Drawer, ListItemButton, ListItemText, Toolbar, Box, Collapse, ThemeProvider, Grid, Paper} from "@mui/material";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login'
import Image from './images/rec2.webp';
import Img from './images/brush.webp'
import axios from 'axios';
import {CLIENT_ID,CLIENT_SECRET,REDIRECT_URI} from './oauth_info.js'
import './Home.css'


const theme=createTheme({
    palette:{
        primary: {
            main:"rgb(30, 86, 125)",
        },
    },
})

axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken'

export default function Home(){
    // const [open, setOpen] = React.useState(-1);
    // const handleClick = (season_no) => {
    //     if(open!=season_no)
    //     setOpen(season_no);
    //     else
    //     setOpen(-1);
    //   };

    const url="https://channeli.in/oauth/authorise/?client_id="+CLIENT_ID+"&redirect_uri="+REDIRECT_URI;

    const login=()=>{
        window.location.href=url;
    }

    return (
    <ThemeProvider theme={theme}>
    <Box>
    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1,height:'6.5vh' }}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, fontFamily:'cursive',fontSize:30}} textAlign="center">
            Information Management Group
          </Typography>
        </Toolbar> 
    </AppBar> 

    {/* <Drawer variant="permanent" sx={{width: '15vw',[`& .MuiDrawer-paper`]: { width: '15vw'},}}> 
        <Toolbar />
        <Toolbar>
        <Typography>
            Recruitment Seasons
        </Typography>
        </Toolbar>
        <Divider />
        <Box>
        <List>
            {Rec_Seasons.map((season,index) =>
            (
            <>
                <ListItemButton onClick={()=>handleClick(index)}>
                <ListItemText primary={"Recruitment Season "+(1+index)} />
                {open==index ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open==index} timeout="auto">
                    <List>
                        <ListItemButton>
                            <ListItemText secondary="1st Year Developer" />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemText secondary="2nd Year Developer" />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemText secondary="1st Year Designer" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <Divider />
            </>
            ))}
        </List>
        </Box>
        <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        sx={{width:'10vw', fontSize:10, position:'absolute',bottom:10, right:10}}>
            Create New Season
        </Button>
    </Drawer> */}

<Box component="div" sx={{p:'1vw', mt:'3vh', pb:'0'}}>

        <Grid container  columnSpacing={20} columns={14} sx={{height:'95vh'}}>
          <Grid item md={8}
          sx={{backgroundImage:`url(${Image})`,
            backgroundRepeat: 'no-repeat',            
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            }}/>

          <Grid item md={6} component={Paper}>
              <Box sx={{height:"60%", width:"40%",
                backgroundImage:`url(${Img})`,
                backgroundRepeat: 'no-repeat',                
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position:"absolute",right:30,top:'10vh'}}>
            </Box>
              <Typography sx={{fontWeight:"bold", fontSize:70,lineHeight:1.5,letterSpacing:-1,fontFamily:'Satisfy',
              position:"absolute",right:"2%",top:'25vh'}} textAlign="center">
                  
                  An In-House Application For <br></br>
                  Managing The
                  Recruitments
                  
              </Typography>
              
              <Button variant="contained" sx={{position:"absolute" ,top:"55%",right:"12%",width:'20vw', height:'5vh'}} onClick={login} >
                  <LoginIcon sx={{mr:3}}/>
              <Typography>
                  Login with ChannelI
                  </Typography>
              </Button>
            </Grid>
        </Grid>
      </Box>
 
    </Box>
    </ThemeProvider>
    )
}