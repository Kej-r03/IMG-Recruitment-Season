import { ThemeProvider,Box,AppBar, Toolbar,Typography,createTheme, Drawer,List,ListItemButton,Divider,ListItemText,Button} from "@mui/material";
import React from "react";
import AddIcon from '@mui/icons-material/Add';


const theme=createTheme({
    palette:{   
        primary: {
            main:"rgb(30, 86, 125)",
        },
    },
})

const rounds=["Test Round","Interview Round 1","Interview Round 2","InterviewRound 3","HR Round"]
export default function Interview(){

    const[selectedIndex,setSelectedIndex]=React.useState(1);

    const handleClick=(index)=>{
        setSelectedIndex(index);
    }

    return(
        <>
        <ThemeProvider theme={theme}>
            <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height:'5.5vh' }}>
                <Toolbar>
                    
                <Typography variant="h6" sx={{flexGrow:1}} textAlign="center">
                
                    Interview
                    
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
        
        </ThemeProvider>
        </>
    )
}