import { ThemeProvider,Modal,Paper,FormControl,InputLabel,Select,Button, Menu, MenuItem,createTheme,Grid, Card,Box,AppBar,Toolbar,Typography, IconButton, CardMedia, CardContent, CircularProgress, Avatar } from "@mui/material";
import React, { useEffect } from "react";
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import Account from "./Account";

axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken'
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

const years=[];
const d=new Date();
for(let i=d.getFullYear();i>2008;i--)
years.push(i)

export default function OnLogin()
{
    const [isLoading,setIsLoading]=React.useState(true)
    const [card,setCard]=React.useState([])
    useEffect(() => {
         axios
         .get("http://localhost:8000/season/",{withCredentials:true})
         .then(function(response){
            setCard(response.data)
            setIsLoading(false)
          });
        },[]);

    if(isLoading==true)
    {
        return (<CircularProgress />)
    }
    return(<AfterLoginPage cards={card} />)
}
    
function AfterLoginPage(props){   
    
    const {cards}=props
    


    //create season
    const [openModal,setOpenModal]=React.useState(false)
    const handleOpenModal= () => {setOpenModal(true)};
    const handleClose = () => {setOpenModal(false)};    
    const createSeason=(year,role)=>{
        const params=JSON.stringify({"season_year":year,"role":role});
        axios
        .post("http://localhost:8000/season/",params,{headers:{"Content-Type" : "application/json"}},{withCredentials:true})
        handleClose()
        window.location.href=window.location.href //reload page
    }
    const [year,setYear]=React.useState('');
    const [role,setRole]=React.useState('');

    const handleYearChange = event => {
        setYear(event.target.value);
      };
    const handleRoleChange = event => {
        setRole(event.target.value);
     };





    
    const redirectCard=(card_id)=>{
        console.log(card_id)
        let url="http://localhost:3000/dashboard/"+card_id+"/"
        window.location.href=url
    }


    return(
        <ThemeProvider theme={theme}>
            <Box>
            <AppBar sx={{height:'6.5vh' }}>
                <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1,fontFamily:'cursive',fontSize:30 }} textAlign="center">
                    IMG Recruitment Seasons
                </Typography>

                <Account />
                </Toolbar> 
            </AppBar> 




            <Box>
                <Toolbar />
            <Grid container justifyContent="center">
            <Paper sx={{width:"60vw", m:"3vh"}} elevation={10}>
                <Grid container spacing={5} sx={{p:4}} justifyContent="center">
                    
             {cards.map((card,index)=>(
                <Grid item md={3.5}>
                    <Card variant="outlined" 
                        onClick={()=>{redirectCard(card.id)}}
                        sx={{cursor:'pointer'}}
                        >
                        <CardMedia>                            
                            {card.role!="Des" && <Avatar variant="square" sx={{height:300,width:270, border:2}} src={require("./images/dev.png")} />}
                            {card.role=="Des" && <Avatar variant="square" sx={{height:300,width:270, border:2}} src={require("./images/des.jpg")} />}
                        </CardMedia>
                        <CardContent>
                        <Typography variant="h3">
                            {card.season_year}
                        </Typography>
                        <Typography variant="h6">
                            {card.role=="1yDev"?"1st Year Developers":card.role=="2yDev"?"2nd Year Developers":"Designers"}
                        </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                    ))}

                </Grid>

               
               
               
               
               
                <Button variant="contained" sx={{width:'10vw', position:"absolute", top:100, right:20}} startIcon={<AddIcon />} onClick={handleOpenModal}>
                    Create Season
                </Button>
                <Modal open={openModal} onClose={handleClose}>
                    <Box  sx={{height:"27vh", width:"20vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3,borderRadius:2.5}}>
                    
                    <Typography sx={{mb:3,fontSize:20,fontWeight:'bold'}}>Create Season</Typography>

                    <FormControl fullWidth sx={{mb:5}}>
                    <InputLabel id="year-label">Year</InputLabel>
                        <Select
                        labelId="year-label"
                        value={year}
                        label="Year"
                        onChange={handleYearChange}
                        >
                            {years.map((year)=>(
                        <MenuItem value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        value={role}
                        label="Role"
                        onChange={handleRoleChange}
                        >
                        <MenuItem value={"1yDev"}>1st Year Developer</MenuItem>
                        <MenuItem value={"2yDev"}>2nd Year Developer</MenuItem>
                        <MenuItem value={"Des"}>1st Year Designer</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="contained" onClick={()=>{createSeason(year,role)}} sx={{position:"absolute", bottom:25, right:25}}>Submit</Button>
                    </Box>
                </Modal>





                </Paper>
            </Grid>
            </Box>
            </Box>
        </ThemeProvider>
    )
}