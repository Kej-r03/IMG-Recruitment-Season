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
import Image from './rec2.webp';
import axios from 'axios';

const theme=createTheme({
    palette:{
        primary: {
            main:"rgb(30, 86, 125)",
        },
    },
})

const Rec_Seasons=["1", "2","3","4","5"]
export default function Home(){
    const [open, setOpen] = React.useState(-1);
    const handleClick = (season_no) => {
        if(open!=season_no)
        setOpen(season_no);
        else
        setOpen(-1);
      };
    return (
    <ThemeProvider theme={theme}>
    <Box>
    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1,height:'5.5vh' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }} textAlign="center">
            Home
          </Typography>
        </Toolbar> 
    </AppBar> 

    <Drawer variant="permanent" sx={{width: '15vw',[`& .MuiDrawer-paper`]: { width: '15vw'},}}> 
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
        sx={{width:'10vw', fontSize:10, position:'absolute',bottom:10, right:10}} 
        disablePadding>
            Create New Season
        </Button>
    </Drawer>

<Box component="div" sx={{p:'1vw',ml:'15vw', mt:'3vh', pb:'0'}}>
    {/* used margin and padding to set correct position, combined with columnSpacing and number of columns */}

        <Grid container  columnSpacing={10} columns={13} sx={{height:'95vh'}}>
          <Grid item md={10}
          sx={{backgroundImage:`url(${Image})`,
            backgroundRepeat: 'no-repeat',
            
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            }}/>

          <Grid item md={3} component={Paper}>
              
              <Button variant="contained" sx={{top:"10%",right:"15%",width:'15vw'}} onClick={()=>{axios.get("http://localhost:8000/login/login1/"); window.location.replace("http://localhost:8000/login/login1/");}} >
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