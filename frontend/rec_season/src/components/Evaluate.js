import React from "react";
import { ThemeProvider, Button,Typography,Link,Breadcrumbs,createTheme,AppBar, Paper,Table, TablePagination,TableFooter, Toolbar,Box,Tabs,Tab,Divider, TableContainer, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Checkbox } from "@mui/material";

const theme=createTheme({
    palette:{   
        primary: {
            main:"rgb(30, 86, 125)",
        },
    },
})
const breadcrumbs=["Home","Evaluate"];
export default function Evaluate(){
    
    return(
        <ThemeProvider theme={theme}>
            
            <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height:'5.5vh' }}>
                <Toolbar>
                    
                <Typography variant="h6" sx={{flexGrow:1}} textAlign="center">
                
                    Candidate Evaluation
                    
                </Typography>
                
                </Toolbar>
            </AppBar>

            <Box sx={{p:5}}>
                <Toolbar />
                <Breadcrumbs separator=">" sx={{mb: 5}}>
                    {breadcrumbs.map((item) =>(
                        <>
                        <Link>{item}</Link>
                        </>
                    ))}
                </Breadcrumbs>
                
            </Box>
        </ThemeProvider>
    )
}