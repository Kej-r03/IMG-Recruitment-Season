import React, { Component }from "react";
import './sidebar.css'
import { createTheme } from '@mui/material/styles'
import List from '@material-ui/core/List';
import { ListItem } from "@material-ui/core";
import { AppBar, Drawer, ListItemButton, ListItemText, Toolbar, Box, Collapse, ThemeProvider, Grid, Paper} from "@mui/material";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { fontSize, width } from "@mui/system";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login'
import Image from './rec2.webp';


const theme=createTheme({
    palette:{
        primary: {
            main:"rgb(30, 86, 125)",
        },
    },
})

const styles = {
    paper: {
      height: 140,
      width: 100,
      backgroundColor: "black"
    }
  };

const Rec_Seasons=["1", "2","3","4","5"]
export default function SideList(){
    const [open, setOpen] = React.useState(-1);
    const handleClick = (season_no) => {
        if(open!=season_no)
        setOpen(season_no);
        else
        setOpen(-1)
      };
    return (
    <ThemeProvider theme={theme}>
    <Box sx={{display: 'flex'}}>
    <AppBar className="app-bar" >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Home
          </Typography>
          {/* <Button color="inherit">Login</Button>  */}
        </Toolbar> 
    </AppBar> 

    <Drawer variant="permanent" sx={{width: '15vw',[`& .MuiDrawer-paper`]: { width: '15vw'},}}> 
        <Toolbar>
        <Typography>
            Recruitment Seasons
        </Typography>
        </Toolbar>
        <Divider />
        <Box>
        <List className="sideList">
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
        sx={{width:200, fontSize:10, position:'absolute',bottom:10, right:10}} 
        disablePadding>
            Create New Season
        </Button>
    </Drawer>

<Box component="div" sx={{p:'1vw'}}>
<Toolbar /> 
        <Grid container columnSpacing={10} columns={13} sx={{width:'82vw', height:'96.7vh', ml:'1vw'}}>
          <Grid item md={10}
          sx={{backgroundImage:`url(${Image})`,
            backgroundRepeat: 'no-repeat',
            
            backgroundSize: 'cover',
            backgroundPosition: 'center',}}/>

          <Grid item md={3} component={Paper}>
              
              <Button variant="contained" sx={{top:"10%",right:"15%",width:300}} >
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