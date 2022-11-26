import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppBar, Tab,Modal,ThemeProvider,Chip,Box,Typography,Card,CardContent,Link, Toolbar, Button, Drawer, Divider, List, ListItemButton ,ListItemText, Grid, Breadcrumbs, Tabs, Accordion, AccordionSummary, AccordionDetails, ListItem, FormControl,InputLabel,Select,TextField} from "@mui/material";
import axios from "axios";
import NavBar from "../NavBar";
import Account from '../Account';
import { MenuItem,Paper,Menu,IconButton, Avatar} from "@mui/material";
import { createTheme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add';


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

export default function Panel(){
    const {id}=useParams()

    return(
        <ThemeProvider theme={theme}>
            
            <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height:'6.5vh' }}>
                <Toolbar>
                    
                <Typography variant="h6" sx={{flexGrow:1,fontFamily:'cursive',fontSize:30 }} textAlign="center">
                
                    Interview Panels
                    
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
                    <ListItemButton onClick={()=>{window.location.href="http://localhost:3000/interview/"+id+"/"}}>
                            <ListItemText primary="Interview Round"/>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton  selected={true}>
                            <ListItemText primary="Interview Panels"/>
                    </ListItemButton>
                    <Divider />
                </List>
            </Drawer>

            <Box component="main" sx={{ml:'15vw',mt:'5vw', p:3}}>
                <PanelDisplay id={id}/>
            </Box>
        </ThemeProvider>
    )
}

function PanelDisplay(props){
    const {id}=props;

    const [imgmembers,setImgmembers]=React.useState()
    const [panels,setPanels]=React.useState()
    useEffect(()=>{
        axios
        .get("http://localhost:8000/img_member/",{withCredentials:true})
        .then(function(response){
            setImgmembers(response.data)
        })
        axios
        .get("http://localhost:8000/interview_panel/get_info/",{params:{season_id:id}},{withCredentials:true})
        .then(function(response){
            setPanels(response.data)
        })
    },[])



    const [openModal,setOpenModal]=React.useState(false)
    const [location,setLocation]=React.useState(null)
    const [panelStatus,setPanelStatus]=React.useState(null)
    const [interviewer1,setInterviewer1]=React.useState(null)
    const [interviewer2,setInterviewer2]=React.useState(null)
    const handleModalOpen=()=>{setOpenModal(true)}
    const handleModalClose=()=>{setOpenModal(false);setLocation(null);setPanelStatus(null);setInterviewer1(null);setInterviewer2(null)}
    const handleLocationEdit=(event)=>{setLocation(event.target.value)}
    const handlePanelStatus=(event)=>{setPanelStatus(event.target.value)}
    const handleInterviewer1Change=(event)=>{setInterviewer1(event.target.value)}
    const handleInterviewer2Change=(event)=>{setInterviewer2(event.target.value)}
    const createPanel=()=>{
        const params=JSON.stringify({"season_id":id,"location":location,"panelStatus":panelStatus,"int1":interviewer1,"int2":interviewer2})
        axios
        .post("http://localhost:8000/interview_panel/create_panel/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        .then(function(response){
            handleModalClose()
            window.location.href=window.location.href
        })
    }


    const deletePanel=(index)=>{
        const params=JSON.stringify({"panel_id":panels[index].id})//use panel primary key id
        axios
        .post("http://localhost:8000/interview_panel/delete_panel/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        .then(function(response){
            handleModalClose()
            window.location.href=window.location.href
        })
    }



    const updatePanel=(index)=>{
        var params={"panel_id":panels[index].id,"location":location,"panelStatus":panelStatus,"int1":interviewer1,"int2":interviewer2}
        if(location==null)
        params['location']=panels[index].location
        if(interviewer1==null)
        params['int1']=panels[index].interviewer1
        if(interviewer2==null)
        params['int2']=panels[index].interviewer2
        if(panelStatus==null)
        params['panelStatus']=panels[index].active
        params=JSON.stringify(params)
        axios
        .post("http://localhost:8000/interview_panel/update_panel/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        .then(function(response){
            handleModalClose()
            window.location.href=window.location.href
        })
    }
    return(
        <>
        <Button variant="contained" startIcon={<AddIcon />} sx={{position:'absolute', right:'3vw', top:'15vh',width:'10vw'}} onClick={handleModalOpen}>Add Panel</Button>

        <Modal open={openModal} onClose={handleModalClose}>
        <Box sx={{height:"40vh", width:"20vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3,borderRadius:2.5}}>
            <Typography sx={{mb:3,fontWeight:'bold',fontSize:20}}>Add Panel</Typography>

                <TextField label="Location" onChange={handleLocationEdit} sx={{mb:3,width:'20vw'}}/><br />

                <FormControl sx={{mb:3}}>
                <InputLabel id="int1">Interviewer 1</InputLabel>
                <Select labelID="int1" label="Interviewer 1" value={interviewer1} onChange={handleInterviewer1Change} sx={{width:'20vw'}}>
                    {imgmembers && imgmembers.map((member)=>(
                        <MenuItem value={member.id}>{member.name}</MenuItem>
                    ))}
                </Select>
                </FormControl><br />
                <FormControl sx={{mb:3}}>
                <InputLabel id="int2">Interviewer 2</InputLabel>
                <Select labelID="int2" label="Interviewer 2" value={interviewer2}  onChange={handleInterviewer2Change} sx={{width:'20vw'}}>
                    {imgmembers && imgmembers.map((member)=>(
                        <MenuItem value={member.id}>{member.name}</MenuItem>
                    ))}
                </Select>
                </FormControl>

                <FormControl sx={{mb:3}}>
                <InputLabel id="panel_stat">Panel Status</InputLabel>
                <Select labelID="panel_stat" label="Panel Status" value={panelStatus} onChange={handlePanelStatus} sx={{width:'20vw'}}>
                    <MenuItem value="Free">Free</MenuItem>
                    <MenuItem value="Busy">Busy</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
                </FormControl>

                <Button variant="contained" onClick={createPanel} sx={{position:'absolute',right:'1.5vw',bottom:'1.5vh'}}>Create</Button>
        </Box>
        </Modal>

        <Grid container spacing={5} sx={{p:4}} justifyContent="center">
            {panels!=null && panels.map((panel,index)=>(
                <Grid item md={4} mt={10}>
                <Card variant="outlined" sx={{height:'55vh',border:1}}>
                    <CardContent>
                        <Typography variant="h4" sx={{ml:4}}>Panel ID #{panel.id}</Typography>
                        <Button variant="outlined" sx={{position:"relative", left:'17vw', bottom:'4vh'}} onClick={()=>{deletePanel(index)}}>Remove</Button>
                        <Divider />
                        <Box sx={{p:3}}>

                        <TextField label="Location" defaultValue={panel.location} onChange={handleLocationEdit} sx={{width:'15vw'}}></TextField>
                        
                        <Box sx={{mt:2}}>
                        <FormControl sx={{mb:3}}>
                        <InputLabel id="int1">Interviewer 1</InputLabel>
                        <Select labelID="int1" label="Interviewer 1" defaultValue={panel.interviewer1} onChange={handleInterviewer1Change} sx={{width:'15vw'}}>
                            {imgmembers.map((member)=>(
                                <MenuItem value={member.id}>{member.name}</MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        </Box>
                        
                        <Box sx={{mt:2}}>
                        <FormControl sx={{mb:3}}>
                        <InputLabel id="int2">Interviewer 2</InputLabel>
                        <Select labelID="int2" label="Interviewer 2" defaultValue={panel.interviewer2} onChange={handleInterviewer2Change} sx={{width:'15vw'}}>
                            {imgmembers.map((member)=>(
                                <MenuItem value={member.id}>{member.name}</MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        </Box>
                        
                        <Box sx={{mt:2}}>
                        <FormControl>
                        <InputLabel id="status">Panel Status</InputLabel>
                        <Select labelID="status" label="Panel Status" defaultValue={panel.active=='F'?"Free":panel.active=='B'?"Busy":panel.active=="I"?"Inactive":""} onChange={handlePanelStatus} sx={{width:'15vw'}}>
                            <MenuItem value={'Free'}>Free</MenuItem>
                            <MenuItem value={'Busy'}>Busy</MenuItem>
                            <MenuItem value={'Inactive'}>Inactive</MenuItem>
                        </Select>
                        </FormControl>
                        </Box>
                        <Button variant="outlined" sx={{postion:"absolute",left:'16vw',top:'3vh'}} onClick={()=>{updatePanel(index)}}>Update</Button>
                        </Box>
                    </CardContent>
                </Card>
                </Grid>
                
            ))}
        </Grid>
        </>
    )

}