import { AppBar, Tab,Modal,ThemeProvider,Chip,Box,Typography  ,Link, Toolbar, Button, Drawer, Divider, List, ListItemButton ,ListItemText, Grid, Breadcrumbs, Tabs, Accordion, AccordionSummary, AccordionDetails, ListItem, Dialog, Backdrop, TextField} from "@mui/material";
import { createTheme } from '@mui/material/styles'
import React from "react";
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import App from "../App";

const theme=createTheme({
    palette:{   
        primary: {
            main:"rgb(30, 86, 125)",
        },
    },
})

const breadcrumbs=["Home","Rounds","Test"]
const rounds=["Test Round","Interview Round 1","Interview Round 2","InterviewRound 3","HR Round"]
export default function Test(){

    const[selectedIndex,setSelectedIndex]=React.useState(0);

    const handleClick=(index)=>{
        setSelectedIndex(index);
    }
    return(
        <ThemeProvider theme={theme}>
            
            <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height:'5.5vh' }}>
                <Toolbar>
                    
                <Typography variant="h6" sx={{flexGrow:1}} textAlign="center">
                
                    Recruitment Test
                    
                </Typography>
                
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
                    {rounds.map((round,index)=>(
                        <>
                        <ListItemButton selected={selectedIndex==index} onClick={()=>(handleClick(index))}>
                            <ListItemText primary={round} />
                        </ListItemButton>
                        <Divider />
                        </>
                    ))}
                </List>

                <Button variant="contained" sx={{width:'10vw', position:"absolute", bottom:10, right:10}} startIcon={<AddIcon />}>
                    Add New Round
                </Button>
            </Drawer>

            <Box component="main" sx={{ml:'15vw',mt:'5vw', p:3}}>
                <Breadcrumbs separator=">">
                    {breadcrumbs.map((item) =>(
                        <>
                        <Link>{item}</Link>
                        </>
                    ))}
                </Breadcrumbs>
                <Button variant="contained" sx={{position:"absolute", right:"5vw", top:"10vh", width:'10vw'}} startIcon={<AssignmentIcon />}>Evaluate</Button>
                <Typography sx={{mt:5}}>
                    Test Details
                </Typography>
                
                <PaperTab />
                
            </Box>

            

        </ThemeProvider>
    )
}

function TabPanel(props){
    const { children, value, index } = props;
    return (
        <Typography hidden={value!==index}>
        {children}
        </Typography>
    );
}

const papers=[1,2,3];
const section=["Aptitude","OOPS","CP","Web Development"];
function PaperTab(){
    const[value,setValue]=React.useState(0);
    function handleChange(event,newValue){
        setValue(newValue);
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return(
        <>
        <Toolbar>
            <Tabs 
            value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"  >
               {papers.map((paper) => (
                   
                   <Tab label={`Paper ${paper}`} />
                   
               ))}
          </Tabs>
          <Button variant="outlined" startIcon={<AddIcon />} sx={{position:"absolute", right:"25%"}}>Add Paper</Button>
        </Toolbar>
        
        <Divider />

        <Box sx={{m:"2.5vw"}}>
        {papers.map((paper, index)=>(
            <TabPanel value={value} index={index}>
                <Box sx={{md:2}}>
                Sections
                <Button variant="outlined" startIcon={<AddIcon />} sx={{position:"absolute", right:"22%"}}>Add Sections</Button>
                </Box>
                {section.map((sec) => (
                    <Accordion sx={{mt:3, width:"60vw"}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{height:"7vh"}}>
                        {sec}
                        <Chip label="Weightage" sx={{position:"absolute", right: 250}} />
                        <Button variant="text" sx={{width:'10vw', position:"absolute",bottom:10, right:60}} startIcon={<AddIcon />}>
                            Add Question
                        </Button>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails>
                        <List>
                            <ListItem>
                            <ListItemButton onClick={handleOpen}>
                                Q1
                            </ListItemButton>
                            <Chip label="Assigned To:" sx={{position:"absolute", right: "7vw"}} />
                            <Chip label="Marks:" sx={{position:"absolute", right: "2vw"}} />
                            </ListItem>
                            {/* <ListItemButton onClick={handleOpen}>
                                Q2
                            </ListItemButton> */}
                            
                            <Modal
                            open={open}
                            onClose={handleClose}>
                                <Box sx={{height:"40vh", width:"40vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>
                                <Box>
                                <Typography variant="h4" sx={{mt:6, ml:3}}>
                                    Question Text
                                </Typography>
                                <Chip label="#Question_ID 12345" sx={{position:"absolute", right: "2vw", top:"2vh"}} />
                                </Box>
                                <Divider /> 
                                <TextField sx={{mt:6, ml:3,mr:3, width:"37vw", height:"40vh"}}>
                                    Question Text
                                </TextField>
                                </Box>
                            </Modal>

                        </List>
                    </AccordionDetails>
                </Accordion> 
                ))}
            </TabPanel>
        ))}
        </Box>
        </>
    )
}

// function QuestionModal(){
//     const [open, setOpen] = React.useState(false);
//     const handleOpen = () => setOpen(true);
//     const handleClose = () => setOpen(false);
//     return(
//     <Modal 
//     open={open}
//     onClose={handleClose}>
//         <Box sx={{height:"60vh", width:"50vw"}}>
//             <Typography>
//                 nwjddm
//             </Typography>
//         </Box>
//     </Modal>
//     );
// }