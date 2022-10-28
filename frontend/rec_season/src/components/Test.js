import { AppBar, Tab,Modal,ThemeProvider,Chip,Box,Typography,Link, Toolbar, Button, Drawer, Divider, List, ListItemButton ,ListItemText, Grid, Breadcrumbs, Tabs, Accordion, AccordionSummary, AccordionDetails, ListItem, FormControl,InputLabel,Select,TextField} from "@mui/material";
import { MenuItem,Paper,Menu,IconButton, Avatar} from "@mui/material";
import { createTheme } from '@mui/material/styles'
import React, { useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import App from "../App";
import axios from "axios";
import NavBar from "./NavBar";
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

export default function Test(){

    const {id}=useParams()


    const [open,setOpen]=React.useState(false)
    const [anchorEl,setAnchorEl]=React.useState(null)
    const openMenu=(event)=>{
        setOpen(!open)
        setAnchorEl(event.currentTarget)
    }

    return(
        <ThemeProvider theme={theme}>
            
            <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height:'6.5vh' }}>
                <Toolbar>
                    
                <Typography variant="h6" sx={{flexGrow:1,fontFamily:'cursive',fontSize:30 }} textAlign="center">
                
                    Recruitment Test
                    
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
                    <ListItemButton selected={true}>
                            <ListItemText primary="Test Round"/>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={()=>{window.location.href="http://localhost:3000/interview/"+id+"/"}}>
                            <ListItemText primary="Interview Round"/>
                    </ListItemButton>
                    <Divider />
                </List>
            </Drawer>

            <Box component="main" sx={{ml:'15vw',mt:'5vw', p:3}}>
                
                <Typography sx={{ml:3, fontSize:25,fontWeight:'bold'}}>
                    Test Details
                </Typography>
                <div title="Go To Dashboard">
                <Button variant="contained"  onClick={()=>{window.location.href="http://localhost:3000/dashboard/"+id+"/"}} startIcon={<AssignmentIcon />} sx={{position:"relative",left:"70vw", }}>Evaluate</Button>
                </div>
                
                <PaperTab id={id}/>
                
            </Box>

            

        </ThemeProvider>
    )
}

function PaperTab(props){

    const {id}=props

    //tab state variables
    const[tabValue,setTabValue]=React.useState(1);
    function handleTabChange(event,newValue){
        setTabValue(newValue);
    }


    //body state variables
    const [papers,setPapers]=React.useState([])
    const [sections,setSections]=React.useState([])
    useEffect(()=>{
        axios
        .get("http://localhost:8000/paper/get_papers/",{params:{season:id}},{withCredentials:true})
        .then(function(response){
            setPapers(response.data)
            setTabValue(0)
        })

        axios
        .get("http://localhost:8000/img_member/",{withCredentials:true})
        .then(function(response){
            setImgmembers(response.data)
        })
    },[])
    useEffect(()=>{
        {papers[tabValue] && 
        axios
        .get("http://localhost:8000/testsection/get_sections/",{params:{paper_id:papers[tabValue].id}},{withCredentials:true})
        .then(function(response){
            setSections(response.data)
        })}
    },[tabValue])



    //update question details modal
    const [imgmembers,setImgmembers]=React.useState()
    const [modalValue,setModalValue]=React.useState(-1)
    const [modalOpen, setModalOpen] = React.useState(false);
    const handleModalOpen = (id,q_text,assigned_to_id,total_marks) => {setModalOpen(true);setModalValue(id);setQuesValue(q_text);setSelectValue(assigned_to_id);setMarkValue(total_marks)}
    const handleModalClose = () => {setModalOpen(false);setModalValue(-1);setSelectValue();setQuesValue();setMarkValue()}
    const [selectValue,setSelectValue]=React.useState()
    const [quesValue,setQuesValue]=React.useState()
    const [markValue,setMarkValue]=React.useState()
    const handleSelectChange=(event)=>{
        setSelectValue(event.target.value)
    }
    const handleQuesChange=(event)=>{
        setQuesValue(event.target.value)
    }
    const handleMarkChange=(event)=>{
        setMarkValue(event.target.value)
    }
    const updateQuestion=()=>{
        const params=JSON.stringify({'id':modalValue,'q_text':quesValue,'assigned_to':selectValue,'total_marks':markValue})
        axios
        .post("http://localhost:8000/testquestion/update_question/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})        
        handleModalClose()
        window.location.href=window.location.href
    }






    //weightage Modal
    const [openWeightageModal,setOpenWeightageModal]=React.useState(false)
    const [weightageModalValue,setWeightageModalValue]=React.useState(-1)
    const [weightage,setWeightage]=React.useState()
    const handleWeightageModalOpen=(id)=>{setOpenWeightageModal(true);setWeightageModalValue(id);}
    const handleWeightageModalClose=()=>{setOpenWeightageModal(false);setWeightageModalValue(-1);setWeightage();}
    const handleWeightageChange=(event)=>{
        setWeightage(event.target.value)
    }
    const updateWeightage=(id)=>{
        const params=JSON.stringify({"weightage":weightage,"id":id})
        axios
        .post("http://localhost:8000/testsection/update_weightage/",params,{headers:{"Content-Type":"application/json"}},{withCredentials:true})
        handleWeightageModalClose()
        window.location.href=window.location.href
    }




    //add section Modal
    const [openSectionModal,setOpenSectionModal]=React.useState(false)
    const [sectionName,setSectionName]=React.useState()
    const [percentWeightage,setPercentWeightage]=React.useState()
    const handleSectionModalOpen=()=>{setOpenSectionModal(true);}
    const handleSectionModalClose=()=>{setOpenSectionModal(false);setSectionName();setPercentWeightage();}
    const handleSectionNameAdd=(event)=>{
        setSectionName(event.target.value)
    }
    const handleSectionWeightageAdd=(event)=>{
        setPercentWeightage(event.target.value)
    }
    const createSection=()=>{
        const params=JSON.stringify({"percent_weightage":percentWeightage,"section_name":sectionName,"paper_id":papers[tabValue].id})
        axios
        .post("http://localhost:8000/testsection/create_section/",params,{headers:{"Content-Type":"application/json"}},{withCredentials:true})
        .then(function(response){
            handleSectionModalClose()
            window.location.href=window.location.href
        })
    }




    //add question modal
    const [openNewQuestionModal,setOpenNewQuestionModal]=React.useState(false)
    const [newQuestionModalValue,setNewQuestionModalValue]=React.useState(-1)
    const [newQuesId,setNewQuesId]=React.useState()
    const [newQuesText,setNewQuesText]=React.useState()
    const [newQuesSelect,setNewQuesSelect]=React.useState()
    const [newQuesMarks,setNewQuesMarks]=React.useState()
    const handleNewQuestionModalOpen=(id)=>{setOpenNewQuestionModal(true);setNewQuestionModalValue(id);}
    const handleNewQuestionModalClose=()=>{setOpenNewQuestionModal(false);setNewQuestionModalValue(-1);setNewQuesId();setNewQuesMarks();setNewQuesSelect();setNewQuesText()}
    const handleNewQuesIdChange=(event)=>{
        setNewQuesId(event.target.value)
    }
    const handleNewQuesDetailChange=(event)=>{
        setNewQuesText(event.target.value)
    }
    const handleNewQuesSelectChange=(event)=>{
        setNewQuesSelect(event.target.value)
    }
    const handleNewQuesMarksChange=(event)=>{
        setNewQuesMarks(event.target.value)
    }
    const createQuestion=()=>{//will write on getting imgmembers from request
        const params=JSON.stringify({'id':newQuestionModalValue,'q_id':newQuesId,'q_text':newQuesText,'assigned_to':newQuesSelect,'total_marks':newQuesMarks})
        axios
        .post("http://localhost:8000/testquestion/create_question/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        handleNewQuestionModalClose()
        window.location.href=window.location.href
    }




    //add paper Modal
    const [openPaperModal,setOpenPaperModal]=React.useState(false)
    const [paperNumber,setPaperNumber]=React.useState()
    const [timing,setTiming]=React.useState()
    const handlePaperModalOpen=()=>{setOpenPaperModal(true)}
    const handlePaperModalClose=()=>{setOpenPaperModal(false);setPaperNumber();setTiming()}
    const handlePaperNumberAdd=(event)=>{
        setPaperNumber(event.target.value)
    }
    const handleTimingAdd=(event)=>{
        setTiming(event.target.value)
    }
    const createPaper=()=>{
        const params=JSON.stringify({"no":paperNumber,"timing":timing,"season_id":id})
        axios
        .post("http://localhost:8000/paper/create_paper/",params,{headers:{"Content-Type":"application/json"}},{withCredentials:true})
        handlePaperModalClose()
        window.location.href=window.location.href
    }
    return(
        <>
        <Toolbar>
            <Tabs 
            value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"  >
               {papers.map((paper) => (
                   
                   <Tab label={`Paper ${paper.no}`} />
                   
               ))}
          </Tabs>
          <Button variant="outlined" startIcon={<AddIcon />} sx={{position:"absolute", right:"25%"}} onClick={handlePaperModalOpen}>Add Paper</Button>

          <Modal open={openPaperModal} onClose={handlePaperModalClose}>
              <Box sx={{height:"17vh", width:"15vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>
                    <Typography>Paper Number</Typography>
                    <input type="number" onChange={handlePaperNumberAdd} />
                    <Typography>Paper Timing</Typography>
                    <input type="datetime-local" onChange={handleTimingAdd} />

                    <Button variant="contained" onClick={createPaper} sx={{position:'absolute',right:'2vw',bottom:'2vh'}}>Add Paper</Button>
              </Box>
          </Modal>
        </Toolbar>



        
        <Divider />




        <Box sx={{m:"2.5vw"}}>
            <>
                <Box sx={{mb:3}}>
                    {papers[tabValue]!=null && <Chip label={"Timing: "+papers[tabValue].timing.substring(0,10)+" / "+papers[tabValue].timing.substring(11,19)}  />}
                </Box>

                <Box sx={{mb:3}}>
                Sections
                <Button variant="outlined" startIcon={<AddIcon />} sx={{position:"absolute", right:"22%"}} onClick={handleSectionModalOpen}>Add Sections</Button>
                </Box>

                <Modal open={openSectionModal} onClose={handleSectionModalClose}>
                    <Box sx={{height:"20vh", width:"15vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>
                        <Typography>Section Name</Typography>
                        <input type="text" onChange={handleSectionNameAdd} />
                        <Typography>Section Percent Weightage</Typography>
                        <input type="number" onChange={handleSectionWeightageAdd} />

                        <Button variant="contained" onClick={createSection} sx={{mt:'2vh'}}>Create Section</Button>
                    </Box>
                </Modal>




                {sections.map((section) => (
                    <Accordion sx={{mt:3, width:"60vw"}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{height:"7vh"}}>
                        {section.section_name}
                        <Chip label={"Weightage: "+section.percent_weightage} sx={{position:"absolute", right: 250}} onClick={()=>{handleWeightageModalOpen(section.id)}} />
                        
                        <Modal open={openWeightageModal && weightageModalValue==section.id} onClose={handleWeightageModalClose}>
                            <Box sx={{height:"10vh", width:"10vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>
                                <Typography>Update {section.name} Weightage</Typography>
                                <input type="number" defaultValue={section.percent_weightage} onChange={handleWeightageChange}/>
                                <Button variant="contained" sx={{position:"absolute", right:'3vw',bottom:'2vh'}} onClick={()=>{updateWeightage(section.id)}}>Update</Button>
                            </Box>
                        </Modal>




                        <Button variant="outlined" sx={{width:'10vw', position:"absolute",bottom:10, right:50}} startIcon={<AddIcon />} onClick={()=>{handleNewQuestionModalOpen(section.id)}}>
                            Add Question
                        </Button>
                        
                         <Modal
                            open={openNewQuestionModal && newQuestionModalValue==section.id}
                            onClose={handleNewQuestionModalClose}
                            >
                                <Box sx={{height:"70vh", width:"40vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>

                                <Typography variant="h4" sx={{mt:5, ml:3}}>Question ID</Typography>
                                <Divider /> 
                                <FormControl>
                                <TextField sx={{mt:3, ml:3,mr:3, width:"37vw"}} onChange={handleNewQuesIdChange} />
                                </FormControl>


                                <Typography variant="h4" sx={{mt:2, ml:3}}>Question Text</Typography>
                                <Divider /> 
                                <FormControl>
                                <TextField sx={{mt:3, ml:3,mr:3, width:"37vw"}} onChange={handleNewQuesDetailChange} />
                                </FormControl>

                                
                                <Typography variant="h4" sx={{mt:6, ml:3}}>Assigned To</Typography>
                                <Divider />
                                <FormControl sx={{ml:3,mr:3, width:"37vw",height:'10vh'}}>
                                <Box sx={{mt:4}}>
                                <Select value={newQuesSelect} style={{height:'5vh',width:'37vw'}} onChange={handleNewQuesSelectChange}>
                                 {imgmembers && imgmembers.map((member)=>(
                                        <MenuItem value={member.id}>{member.name}</MenuItem>
                                    ))}
                                </Select>
                                </Box>
                                </FormControl>
                                
                                <div style={{marginTop:"48px",marginLeft:"24px"}}>
                                <Typography variant="h4">Marks</Typography>
                                <Divider />
                                <Box sx={{mt:4}}>
                                <input type="number" id="marks" style={{height:'3vh'}} onChange={handleNewQuesMarksChange}/>
                                </Box>
                                </div>

                                <Button variant="contained" sx={{position:'absolute', right:'5vw'}} onClick={createQuestion}>Create Question</Button>
                                </Box>
                            </Modal>
                    </AccordionSummary>





                    <Divider />






                    <AccordionDetails>
                        <List>
                            {section.ques_list.map((ques)=>(
                                <>
                            <ListItem>
                            <ListItemButton onClick={()=>{handleModalOpen(ques.id,ques.q_text,ques.assigned_to_id,ques.total_marks)}}>
                                Q_ID{ques.q_id}
                            </ListItemButton>
                            <Chip label={"Assigned To: "+ques.assigned_to_name} sx={{position:"absolute", right: "20vw"}} />
                            <Chip label={"Marks: "+ques.total_marks} sx={{position:"absolute", right: "2vw"}} />
                            </ListItem>                       

                            
                            <Modal
                            open={modalValue==ques.id &&modalOpen}
                            onClose={handleModalClose}
                            >
                                <Box sx={{height:"54vh", width:"40vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>
                                <Box>
                                <Typography variant="h4" sx={{mt:5, ml:3}}>
                                    Question Text
                                </Typography>
                                <Chip label={"#Question_ID: "+ques.id} sx={{position:"absolute", right: "2vw", top:"2vh"}} />
                                </Box>
                                <Divider /> 

                                <FormControl>
                                <TextField defaultValue={ques.q_text} sx={{mt:3, ml:3,mr:3, width:"37vw"}} onChange={handleQuesChange} />
                                </FormControl>

                                
                                <Typography variant="h4" sx={{mt:6, ml:3}}>Update Assigned To</Typography>
                                <Divider />
                                <FormControl sx={{ml:3,mr:3, width:"37vw",height:'10vh'}}>
                                <Box sx={{mt:4}}>
                                <select defaultValue={ques.assigned_to_name} value={selectValue} style={{height:'5vh',width:'37vw'}} onChange={handleSelectChange}>
                                    {imgmembers.map((member)=>(
                                        <option value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                                </Box>
                                </FormControl>
                                
                                <div style={{marginTop:"48px",marginLeft:"24px"}}>
                                <Typography variant="h4">Update Marks</Typography>
                                <Divider />
                                <Box sx={{mt:4}}>
                                <input type="number" defaultValue={ques.total_marks} id="marks" style={{height:'3vh'}} onChange={handleMarkChange}/>
                                </Box>
                                </div>
                                
                                <Button variant="contained" sx={{position:'absolute', right:'5vw'}} onClick={updateQuestion}>Update</Button>
                                </Box>
                            </Modal>
                            <Divider />
                            </> 
                            ))}                            

                        </List>
                    </AccordionDetails>
                </Accordion> 
                ))}
             </>
        </Box>
        </>
    )
}




{/* <Modal
                            open={modalOpen}
                            onClose={handleModalClose}
                            >
                                <Box sx={{height:"54vh", width:"40vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>
                                <Box>
                                <Typography variant="h4" sx={{mt:5, ml:3}}>
                                    Question Text
                                </Typography>
                                <Chip label="#Question_ID:" sx={{position:"absolute", right: "4vw", top:"2vh"}} />
                                <Chip label={ques.id} sx={{position:"absolute", right: "2vw", top:"2vh"}} />
                                </Box>
                                <Divider /> 

                                <FormControl>
                                <TextField defaultValue={ques.q_text} sx={{mt:3, ml:3,mr:3, width:"37vw"}} onChange={handleQuesChange} />
                                </FormControl>

                                
                                <Typography variant="h4" sx={{mt:6, ml:3}}>Update Assigned To</Typography>
                                <Divider />
                                <FormControl sx={{ml:3,mr:3, width:"37vw",height:'10vh'}}>
                                <Box sx={{mt:4}}>
                                <select defaultValue={ques.assigned_to_name} value={selectValue} style={{height:'5vh',width:'37vw'}} onChange={handleSelectChange}>
                                    {imgmembers.map((member)=>(
                                        <option value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                                </Box>
                                </FormControl>
                                
                                <div style={{marginTop:"48px",marginLeft:"24px"}}>
                                <Typography variant="h4">Update Marks</Typography>
                                <Divider />
                                <Box sx={{mt:4}}>
                                <input type="number" defaultValue={ques.total_marks} id="marks" style={{height:'3vh'}} onChange={handleMarkChange}/>
                                </Box>
                                </div>

                                <Button variant="contained" sx={{position:'absolute', right:'5vw'}} onClick={updateQuestion}>Update</Button>
                                </Box>
                            </Modal> */}
