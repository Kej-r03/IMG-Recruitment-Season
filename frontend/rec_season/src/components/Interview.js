import { ThemeProvider,Box,AppBar, Toolbar,Typography,Select,createTheme, Grid,Menu,MenuItem,Drawer,List,ListItemButton,Divider,ListItemText,Button, Card,CardContent, Modal} from "@mui/material";
import { IconButton } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import NavBar from './NavBar'
import { useParams } from "react-router-dom";

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

export default function Interview(){

    const {id}=useParams()
    const [open,setOpen]=React.useState(false)
    const [anchorEl,setAnchorEl]=React.useState(null)
    const openMenu=(event)=>{
        setOpen(!open)
        setAnchorEl(event.currentTarget)
    }


    const [intRounds,setIntRounds]=React.useState()
    useEffect(()=>{
        axios
        .get("http://localhost:8000/int_rounds/get_interviews/",{params:{season:id}},{withCredentials:true})
        .then(function(response){
            setIntRounds(response.data)
        })
    },[])



    //create interview modal
    const [openCreateInterview,setOpenCreateInterview]=React.useState(false)
    const [type,setType]=React.useState()
    const handleCreateInterviewModalOpen=()=>{setOpenCreateInterview(true)}
    const handleCreateInterviewModalClose=()=>{setOpenCreateInterview(false)}
    const handleType=(event)=>setType(event.target.value)
    return(
        <>
        <ThemeProvider theme={theme}>
            <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height:'6.5vh' }}>
                <Toolbar>
                    
                <Typography variant="h6" sx={{flexGrow:1,fontFamily:'cursive',fontSize:30 }} textAlign="center">                
                    Interview                    
                </Typography>
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
                <NavBar id={id}/>
                </Toolbar>
            </AppBar>

            

            <Drawer variant="permanent" sx={{width: '15vw',[`& .MuiDrawer-paper`]: { width: '15vw'},}}>
                <Toolbar />
                <Toolbar>
                    <Typography>
                        Rounds
                    </Typography>
                    </Toolbar>
                <Divider />
                <List>
                    <ListItemButton onClick={()=>{window.location.href="http://localhost:3000/test/"+id+"/"}}>
                            <ListItemText primary="Test Round"/>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton  selected={true} >
                            <ListItemText primary="Interview Round"/>
                    </ListItemButton>
                    <Divider />
                </List>
            </Drawer>

            <Box component="main" sx={{ml:'15vw',mt:'5vw', p:3}}>
                {/* <Button variant="contained" sx={{ml:'2vw'}} onClick={handleCreateInterviewModalOpen}>Create Interview</Button>



                <Modal open={openCreateInterview} onClose={handleCreateInterviewModalClose}>
                <Box sx={{height:"17vh", width:"15vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>

                    <Typography>Type</Typography>
                    <Select value={type} onChange={handleType}>
                        {intRounds.map((round)=>(
                            <MenuItem value={round.id}>Interview Round {round.round_no}</MenuItem>
                        ))}
                    </Select>
                    
                    <Typography>Slot Timing</Typography>
                    <input type="datetime-local" onChange={handleTimingEdit} />

                    <Typography>Location</Typography>
                    <input type="text" onChange={handleLocationEdit} />
                    
                    <Typography>Panel Status</Typography>
                    <Select value={panelStatus} onChange={handlePanelStatus}>
                        <MenuItem value="Free">Free</MenuItem>
                        <MenuItem value="Busy">Busy</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>

                    <Button variant="contained" onClick={editInterview} sx={{position:'absolute',right:'2vw',bottom:'2vh'}}>Update</Button>
                </Box>
                </Modal> */}



                <InterviewsDisplay id={id} />
            </Box>
        
        </ThemeProvider>
        </>
    )
}

function InterviewsDisplay(props){

    const {id}=props

    const [interviews,setInterviews]=React.useState()
    useEffect(()=>{
        axios
        .get("http://localhost:8000/interview_panel/get_info/",{params:{season_id:id}},{withCredentials:true})
        .then(function(response){
            console.log(response.data)
            setInterviews(response.data)
        })
    },[])




    //edit interview
    const [openEditInterview,setOpenEditInterview]=React.useState(false)
    const [timing,setTiming]=React.useState()
    const [location,setLocation]=React.useState()
    const [panelStatus,setPanelStatus]=React.useState()
    const [intStatus,setIntStatus]=React.useState()
    const [interviewPanelID,setInterviewPanelID]=React.useState()
    const handleEditInterviewModal=(index)=>{
        setOpenEditInterview(true);
        setInterviewPanelID(interviews[index].id);
        setPanelStatus(interviews[index].active=='F'?"Free":interviews[index].active=='B'?"Busy":interviews[index].active=="I"?"Inactive":"");
        setLocation(interviews[index].location);
        setTiming(interviews[index].slot_timing);
        setIntStatus(interviews[index].status)}
    const handleEditInterviewClose=()=>{setOpenEditInterview(false);setTiming();setLocation();setPanelStatus();setIntStatus();setInterviewPanelID()}
    const handleTimingEdit=(event)=>{setTiming(event.target.value)}
    const handleLocationEdit=(event)=>{setLocation(event.target.value)}
    const handlePanelStatus=(event)=>{setPanelStatus(event.target.value)}
    const handleIntStatus=(event)=>{setIntStatus(event.target.value)}
    const editInterview=()=>{
        const params=JSON.stringify({"timing":timing,"location":location,"panelStatus":panelStatus,"id":interviewPanelID,"intStatus":intStatus})
        axios
        .post("http://localhost:8000/interview_panel/update_interview/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        handleEditInterviewClose()
        window.location.href=window.location.href
    }
    return (
        <>
        <Grid container spacing={5} sx={{p:4}} justifyContent="center">
        {interviews!=null && interviews.map((interview,index)=>(
            <>
            <Grid item md={4}>
            <Card variant="outlined" sx={{cursor:'pointer', height:'75vh'}} onClick={()=>handleEditInterviewModal(index)}>
                <CardContent>
                    <Typography variant="h4">Interview Details</Typography>
                    <Divider />
                    <Box sx={{p:3}}>
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Type:</Typography>
                    <Typography variant="h6">{interview.type=='T'?"Technical":"HR"}</Typography><br />
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Candidate Name:</Typography>
                    <Typography variant="h6">{interview.candidate_name}</Typography><br />
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Candidate Enrolment:</Typography>
                    <Typography variant="h6">{interview.enrolment}</Typography><br />
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Slot Timing:</Typography>
                    {interview.slot_timing!=null && <Typography>{interview.slot_timing.substring(0,10)+" / "+interview.slot_timing.substring(11,19)}</Typography>}<br />
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Location:</Typography>
                    <Typography variant="h6">{interview.location}</Typography><br />
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Interviewers:</Typography>
                    {interview.interviewers.map((interviewer)=>(
                        <Typography variant="h6">{interviewer.name}</Typography>
                    ))}
                    <br />
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Panel Status:</Typography>
                    <Typography variant="h6">{interview.active=='F'?"Free":interview.active=='B'?"Busy":interview.active=="I"?"Inactive":""}</Typography><br />
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Interview Status:</Typography>
                    <Typography variant="h6">{interview.status}</Typography><br />
                    </Box>
                </CardContent>
            </Card>


            <Modal open={openEditInterview} onClose={handleEditInterviewClose}>
            <Box sx={{height:"30vh", width:"15vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>

                <Typography sx={{fontWeight:'bold',fontSize:20}}>Edit Interview Details</Typography>
                    
                    <Typography>Slot Timing</Typography>
                    <input type="datetime-local" onChange={handleTimingEdit} defaultValue={timing}/>

                    <Typography>Location</Typography>
                    <input type="text" onChange={handleLocationEdit} defaultValue={location}/>
                    
                    <Typography>Panel Status</Typography>
                    <Select value={panelStatus} onChange={handlePanelStatus}>
                        <MenuItem value="Free">Free</MenuItem>
                        <MenuItem value="Busy">Busy</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>

                    <Typography>Interview Status</Typography>
                    <Select value={intStatus} onChange={handleIntStatus}>
                        <MenuItem value="Called">Called</MenuItem>
                        <MenuItem value="Not Called">Not Called</MenuItem>
                        <MenuItem value="Ongoing">Ongoing</MenuItem>
                        <MenuItem value="Waitng">Waiting</MenuItem>
                        <MenuItem value="Done">Done</MenuItem>
                    </Select>

                    <Button variant="contained" onClick={editInterview} sx={{position:'absolute',right:'2vw',bottom:'2vh'}}>Update</Button>
            </Box>
            </Modal>
            </Grid>
            </>
        ))}
        </Grid>
        </>
    )
}