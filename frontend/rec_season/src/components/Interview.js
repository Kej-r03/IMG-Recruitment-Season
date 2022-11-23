import { ThemeProvider,TextField,Box,AppBar, Toolbar,Typography,Select,createTheme,FormControl, Grid,Menu,MenuItem,Drawer,List,ListItemButton,Divider,ListItemText,Button, Card,CardContent, Modal} from "@mui/material";
import { IconButton } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import NavBar from './NavBar'
import { useParams } from "react-router-dom";
import Account from "./Account";

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
    const [IMGYear,setIMGYear]=React.useState()
    const [open,setOpen]=React.useState(false)
    const [anchorEl,setAnchorEl]=React.useState(null)
    const openMenu=(event)=>{
        setOpen(!open)
        setAnchorEl(event.currentTarget)
    }


    const [intRounds,setIntRounds]=React.useState()
    useEffect(()=>{
        axios
        .get("http://localhost:8000/login/get_year/",{params:{season_id:id}},{withCredentials:true})
        .then(function(response){
            setIMGYear(response.data.year)
        })
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
                <Account />
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
                    <ListItemButton  onClick={()=>{window.location.href="http://localhost:3000/panel/"+id+"/"}}>
                            <ListItemText primary="Interview Panels"/>
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



                <InterviewsDisplay id={id} IMGYear={IMGYear} />
            </Box>
        
        </ThemeProvider>
        </>
    )
}

function InterviewsDisplay(props){

    const {id,IMGYear}=props

    const [interviews,setInterviews]=React.useState()
    const [panels,setPanels]=React.useState()
    useEffect(()=>{
        axios
        .get("http://localhost:8000/interview/get_info/",{params:{season_id:id}},{withCredentials:true})
        .then(function(response){
            setInterviews(response.data)
        })
        axios
        .get("http://localhost:8000/interview_panel/get_panels/",{params:{season_id:id}},{withCredentials:true})
        .then(function(response){
            setPanels(response.data)
        })
    },[])




    //edit interview
    const [openEditInterview,setOpenEditInterview]=React.useState(false)
    const [timing,setTiming]=React.useState(null)
    const [Id,setId]=React.useState()
    const [panelID,setPanelID]=React.useState(null)
    const [intStatus,setIntStatus]=React.useState(null)
    const [marks,setMarks]=React.useState(null)
    const [remarks,setRemarks]=React.useState(null)
    const handleEditInterviewModal=(index)=>{
        setOpenEditInterview(true);
        setId(interviews[index].id)
        setPanelID(interviews[index].panelID);
        setTiming(interviews[index].slot_timing);
        setIntStatus(interviews[index].status);
        setMarks(interviews[index].marks)
        setRemarks(interviews[index].remarks)
    }
    const handleEditInterviewClose=()=>{setOpenEditInterview(false);setId(null);setTiming(null);setPanelID(null);setIntStatus(null);setMarks(null);setRemarks(null)}
    const handleTimingEdit=(event)=>{setTiming(event.target.value)}
    const handlePanelID=(event)=>{setPanelID(event.target.value)}
    const handleIntStatus=(event)=>{setIntStatus(event.target.value)}
    const handleMarksChange=(event)=>{setMarks(event.target.value)}
    const handleRemarksChange=(event)=>{setRemarks(event.target.value)}
    const editInterview=(index)=>{
        const params=JSON.stringify({"id":Id,"timing":timing,"panelID":panelID,"intStatus":intStatus,"marks":marks,"remarks":remarks})
        axios
        .post("http://localhost:8000/interview/update_interview/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        .then(function(response){
            handleEditInterviewClose()
            window.location.href=window.location.href
        })
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
                    {/* <Typography variant="h5" sx={{fontWeight:'bold'}}>Location:</Typography>
                    <Typography variant="h6">{interview.location}</Typography><br />
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Interviewers:</Typography> */}
                    {/* {interview.interviewers.map((interviewer)=>(
                        <Typography variant="h6">{interviewer.name}</Typography>
                    ))} */}
                    {/* <Typography variant="h6">{interview.interviewer1name}</Typography><br />
                    <Typography variant="h6">{interview.interviewer2name}</Typography><br />
                    <br />
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Panel Status:</Typography>
                    <Typography variant="h6">{interview.active=='F'?"Free":interview.active=='B'?"Busy":interview.active=="I"?"Inactive":""}</Typography><br /> */}
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>PanelID:</Typography>
                    <Typography variant="h6">{interview.panelID}</Typography><br />
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Interview Status:</Typography>
                    <Typography variant="h6">{interview.status}</Typography><br />
                    {IMGYear>2 && <>
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Marks:</Typography>
                    <Typography variant="h6">{interview.marks}</Typography><br />
                    <Typography variant="h5" sx={{fontWeight:'bold'}}>Remarks:</Typography>
                    <Typography variant="h6">{interview.remarks}</Typography><br />
                    </>
                    }
                    </Box>
                </CardContent>
            </Card>


            <Modal open={openEditInterview} onClose={handleEditInterviewClose}>
            <Box sx={{height:"40vh", width:"25vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>

                <Typography sx={{fontWeight:'bold',fontSize:20}}>Edit Interview Details</Typography>
                    
                    <Typography>Slot Timing</Typography>
                    <input type="datetime-local" onChange={handleTimingEdit} defaultValue={timing}/>
                    

                    <Typography>Panel ID</Typography>
                    <Select value={panelID} onChange={handlePanelID}>
                        {panels && panels.map((panel)=>(
                            <MenuItem value={panel}>{panel}</MenuItem>
                        ))}
                    </Select>

                    <Typography>Interview Status</Typography>
                    <Select value={intStatus} onChange={handleIntStatus}>
                        <MenuItem value="Called">Called</MenuItem>
                        <MenuItem value="Not Called">Not Called</MenuItem>
                        <MenuItem value="Ongoing">Ongoing</MenuItem>
                        <MenuItem value="Waitng">Waiting</MenuItem>
                        <MenuItem value="Done">Done</MenuItem>
                    </Select>
                    <br />

                    {IMGYear>2 &&
                    <>
                    <FormControl sx={{mb:3}}>
                        <Typography>Enter Marks</Typography>
                        <input type="number" defaultValue={marks} onChange={handleMarksChange}/>
                    </FormControl>
                    <br />
                    <FormControl>
                        <Typography>Enter Remarks</Typography>
                        <TextField defaultValue={remarks} onChange={handleRemarksChange} />
                    </FormControl>
                    </>
                    }

                    <Button variant="contained" onClick={()=>editInterview()} sx={{position:'absolute',right:'2vw',bottom:'2vh'}}>Update</Button>
            </Box>
            </Modal>
            </Grid>
            </>
        ))}
        </Grid>
        </>
    )
}