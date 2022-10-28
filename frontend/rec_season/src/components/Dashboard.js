import { ThemeProvider,IconButton,Menu,MenuItem,Modal, TextField,Button,Typography,Link,Breadcrumbs,createTheme,AppBar, Paper,Table, TablePagination,TableFooter, Toolbar,Box,Tabs,Tab,Divider, TableContainer, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Checkbox, FormLabel, Radio,RadioGroup, FormControlLabel ,FormControl} from "@mui/material";
import React, { useEffect } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import FontWeight from "./testfile2";
import TestTable from "./TestTable";
import InterviewTable from "./InterviewTable";
import Selected from "./SelectedTable";
import Project from "./ProjectTable";
import NavBar from "./NavBar";
import Account from "./Account";
import { useParams } from "react-router-dom";

//add filter for top X candidates based on weightage



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

    const [int_rounds,setInt_Rounds]=React.useState([])
    const [test_papers,setTest_Papers]=React.useState([])
    useEffect(()=>{
        axios.defaults.withCredentials = true;
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
                   
                   <Tab label={`Interview Round ${index+1}`} sx={{fontSize:17}} />
                   
               ))}

               <Tab label={`Selected`} sx={{fontSize:17}} />
          </Tabs>
          
        </Toolbar>
        
        <Divider />
        
        {value<test_papers.length &&<TestTable value={value} test_papers={test_papers} int_rounds={int_rounds}/>}
        {value==test_papers.length && <Project int_rounds={int_rounds} season_id={season_id} />}
        {value>=test_papers.length+1  && value<int_rounds.length+1+test_papers.length && <InterviewTable int_rounds={int_rounds} index={value-1-test_papers.length}/>}
        {value>=test_papers.length+1+int_rounds.length && <Selected  int_rounds={int_rounds} season_id={season_id}/>}
        </>
    )
}




