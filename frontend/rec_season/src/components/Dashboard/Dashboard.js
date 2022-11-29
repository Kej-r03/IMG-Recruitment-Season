import { ThemeProvider,IconButton,Menu,MenuItem,Modal, TextField,Button,Typography,Link,Breadcrumbs,createTheme,AppBar, Paper,Table, TablePagination,TableFooter, Toolbar,Box,Tabs,Tab,Divider, TableContainer, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Checkbox, FormLabel, Radio,RadioGroup, FormControlLabel ,FormControl, Select, InputLabel} from "@mui/material";
import React, { useEffect } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import TestTable from "./TestTable";
import InterviewTable from "./InterviewTable";
import Selected from "./SelectedTable";
import Project from "./ProjectTable";
import NavBar from "../NavBar";
import Account from "../Account";
import { useParams } from "react-router-dom";

var ws=new WebSocket("ws://127.0.0.1:8000/ws/ac/")

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

export default function Dashboard(){

    let {id}=useParams()

    const [seasonYear,setSeasonYear]=React.useState()
    const [seasonRole,setSeasonRole]=React.useState()
    useEffect(()=>{
        let url="http://localhost:8000/season/"+id+"/"
    axios
    .get(url,{withCredentials:true})
    .then(function(response){
        setSeasonYear(response.data.season_year)
        setSeasonRole(response.data.role)
    })
    },[])


    return(
        <ThemeProvider theme={theme}>
            
            <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height:'6.5vh' }}>
                <Toolbar>                    
                <Typography variant="h6" sx={{flexGrow:1,fontFamily:'cursive',fontSize:30}} textAlign="center">                
                    Dashboard                    
                </Typography>
                 <Account />
                 <NavBar id={id}/>
                </Toolbar>
            </AppBar>
            
            
            

            <Box sx={{p:10}}>
                <Toolbar />
                <Typography variant="h4" sx={{mb:5}}>
                    IMG Recruitment {seasonYear+", Role: "+(seasonRole==='1yDev'?'1st Year Developers':seasonRole=='2yDev'?"2nd Year Developers":"Designers")}
                </Typography>
                <Box>
                    <RoundTab season_id={id}/>
                </Box>
            </Box>
        </ThemeProvider>
    )
}



function RoundTab(props){
    const {season_id}=props

    const[value,setValue]=React.useState(1);
    function handleChange(event,newValue){
        setValue(newValue);
    }


    const [IMGYear,setIMGYear]=React.useState()
    const [int_rounds,setInt_Rounds]=React.useState([])
    const [test_papers,setTest_Papers]=React.useState([])
    useEffect(()=>{
        axios
        .get("http://localhost:8000/login/get_year/",{params:{season_id:season_id}},{withCredentials:true})
        .then(function(response){
            setIMGYear(response.data.year)
        })
        axios
        .get("http://localhost:8000/paper/get_papers/",{params:{season:season_id}},{withCredentials:true})
        .then(function(response){
            setTest_Papers(response.data)
            setValue(0)
        })
        axios
        .get("http://localhost:8000/int_rounds/get_interviews/",{params:{season:season_id}},{withCredentials:true})
        .then(function(response){ 
            setInt_Rounds(response.data)
        })        
    },[])



    const [open,setOpen]=React.useState(false)
    const [round_no,setRound_no]=React.useState()
    const [type,setType]=React.useState()
    const handleModalOpen=()=>setOpen(true)
    const handleModalClose=()=>{setOpen(false);setRound_no();setType();}
    const handleRoundChange=(event)=>setRound_no(event.target.value)
    const handleTypeChange=(event)=>setType(event.target.value)
    const createInterview=()=>{
        const params=JSON.stringify({"round_no":round_no,"interview_type":type.charAt(0),"season":season_id})
        axios
        .post("http://localhost:8000/int_rounds/create_interview_round/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        .then(function(response){
            handleModalClose()
        window.location.href=window.location.href
        })
        
    }
    return(
        <>
        <Toolbar sx={{mb:5}}>
            <Tabs 
            value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary">

              {test_papers.map((paper,index) => (
                   
                   <Tab label={`Test Paper ${index+1}`} sx={{fontSize:17}} />
                   
               ))}

                <Tab label={`Projects`} sx={{fontSize:17}} />

               {int_rounds.map((round,index) => (
                   
                   <Tab label={`Interview Round ${round.round_no} (${round.interview_type})`} sx={{fontSize:17}} />
                   
               ))}

               <Tab label={`Selected`} sx={{fontSize:17}} />
          </Tabs>

          <Button variant="contained" startIcon={<AddIcon />} sx={{position:'absolute', right:'1vw', bottom:'13vh'}} onClick={handleModalOpen}>Add Interview Round</Button>
          {IMGYear>2 && <Button variant="contained" startIcon={<AddIcon />} sx={{position:'absolute', right:'1vw', bottom:'9vh'}} onClick={()=>{window.location.href="http://localhost:3000/test/"+season_id+"/"}}>Add Paper</Button>}
          
          <Modal open={open} onClose={handleModalClose}>
          <Box sx={{height:"25vh", width:"15vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3,borderRadius:2.5}}>
                    
                    <Typography sx={{mb:3,fontSize:20,fontWeight:'bold'}}>Add Interview</Typography>

                    <FormControl sx={{mb:3}}>
                        <TextField label="Interview Round Number" type="number" onChange={handleRoundChange} sx={{width:'15vw'}}/>
                    </FormControl>
                    
                    <FormControl sx={{mb:3}}>
                    <InputLabel id="round_type">Interview Type</InputLabel>
                    <Select labelID="round_type" label="Interview Type" value={type} onChange={handleTypeChange} sx={{width:'15vw'}}>
                        <MenuItem value="Technical">Technical</MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                    </Select>
                    </FormControl>

                    <Button variant="contained" onClick={createInterview} sx={{position:'absolute',right:'2vw',bottom:'2vh'}}>Add Round</Button>
            </Box>
          </Modal>
        </Toolbar>
        
        <Divider />
        
        {value<test_papers.length &&<TestTable value={value} test_papers={test_papers} int_rounds={int_rounds} img_year={IMGYear} ws={ws}/>}
        {value==test_papers.length && <Project int_rounds={int_rounds} season_id={season_id} img_year={IMGYear}/>}
        {value>=test_papers.length+1  && value<int_rounds.length+1+test_papers.length && <InterviewTable int_rounds={int_rounds} index={value-1-test_papers.length} img_year={IMGYear} season_id={season_id}/>}
        {value>=test_papers.length+1+int_rounds.length && <Selected  int_rounds={int_rounds} season_id={season_id}/>}
        </>
    )
}




