import React, { useEffect } from "react";
import { Table,TableHead,TableBody,TableFooter,TablePagination,TableRow,TableCell,TableSortLabel,TableContainer,ThemeProvider,Tabs,Tab,Divider,Breadcrumbs,Link,Modal,Paper,FormControl,InputLabel,Select,Button, Menu, MenuItem,createTheme,Grid, Card,Box,AppBar,Toolbar,Typography, IconButton, CardMedia, CardContent, CircularProgress } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";
import Form from "./Form";



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

const ways_to_enrol=["Projects","Recruitment Test"];
const breadcrumbs=["Home","Candidate List"];

export default function CandidateList(){
    
    const {id}=useParams()

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




    const [open,setOpen]=React.useState(false)
    const [anchorEl,setAnchorEl]=React.useState(null)
    const openMenu=(event)=>{
        setOpen(!open)
        setAnchorEl(event.currentTarget)
    }

    return(
        <ThemeProvider theme={theme}>
            
            <AppBar sx={{height:'6.5vh' }}>
                <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1,fontFamily:'cursive',fontSize:30 }} textAlign="center">
                    Candidate List
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

            

            <Box sx={{p:10}}>
            <Toolbar />
                <Typography variant="h4" sx={{mb:5}}>
                    Showing Candidates in Season {seasonYear+", Role: "+(seasonRole==='1yDev'?'1st Year Developers':seasonRole=='2yDev'?"2nd Year Developers":"Designers")}
                </Typography>

                <Box>
                    <CandidateTable id={id}/>
                </Box>

            </Box>
            
            </ThemeProvider>
    )
}







function CandidateTable(props) //display tabs of the table
{
    const {id}=props
    const[value,setValue]=React.useState(0);

    function handleChange(event,newValue){
        setValue(newValue);  
    }   

    return(
        <>
        <Toolbar>
            <Tabs 
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"  >
               {ways_to_enrol.map((way) => (
                   
                   <Tab label={way} sx={{ml:3,fontSize:17}}/>
                   
               ))}
          </Tabs>
          {/* <SearchOutlinedIcon sx={{positon:"absolute",right:"10vw"}}/> */}
        </Toolbar>
        
        <Divider />

        <Form />
        <TableDisplay value={value} id={id}/>
        {/* to display the table */}

        </>
    )
}


  const headCells=[{value:"Sl No",id:"slno"},{value: "Name",id:"name"},{value:"Enrolment No",id:"enrolment"},{value:"Branch",id:"branch"},{value:"Phone",id:"phone"},{value:"Email ID",id:"email"}]


function TableDisplay(props)//to display headings and sort the rows as per the heading fields
{
    const {value,id} = props;
    const [candidate_list,setCandidate_list]=React.useState([])
    useEffect(()=>{
    axios
        .get("http://localhost:8000/candidate_season_data/",{params:{choice:value,id:id}},{withCredentials:true})
        .then(function(response){
            let cl=[];
            for(var i=0;i<response.data.length;i++)
            {
                cl.push(response.data[i].candidate);
            }
            setCandidate_list(cl)
        })
    },[value])//everytime value of tab changes, get request is called
  




    //order rows
    const [order,setOrder]=React.useState('asc');//variable to store whether to sort by ascending order or descending order
    const [orderBy,setOrderBy]=React.useState("slno");//variable to store column as per which table is sorted
    let orderedRows=candidate_list;
    function createSortHandler(property){
        const isAsc= orderBy === property && order==='asc';
        setOrder(isAsc?'desc':'asc');
        setOrderBy(property);
        let ans=0;
        let ord=isAsc?'desc':'asc'
        orderedRows=candidate_list.sort((a,b)=>{
            let ans=0;
            if(a[property]>b[property])
            ans=1;
            else
            ans=-1;
    
            if(ord==='asc')
            return ans;
            else
            return -ans;
        })
    }

    return(
        <TableContainer>
        <Table>

        <TableHead>
            <TableRow>
                {headCells.map((header)=>(
                    <TableCell>
                       <TableSortLabel 
                       active={orderBy === header.id} //shows which column head is sorted
                       direction={orderBy===header.id?order:'asc'} //if sorting is done as per the header column, order it in the given sense, else in ascending order
                       onClick={()=>{createSortHandler(header.id)}}
                       >
                           <Typography sx={{fontWeight:'bold', fontSize:20}}>
                           {header.value}
                           </Typography>
                        </TableSortLabel> 
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>

        <TableContent orderedRows={orderedRows} candidate_list={candidate_list}/>

        </Table>
        </TableContainer>
    )
}



function TableContent(props){
    const {orderedRows,candidate_list}=props;

    const [page,setPage]=React.useState(0);
    const[rowsPerPage,setRowsPerPage]=React.useState(10);
    const handleChangePage=(event,newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
      };

    return(      
        <>
        <TableBody>
        {(orderedRows.slice(page*rowsPerPage,(page+1)*rowsPerPage)).map((row,index)=>(
            <TableRow>
            <TableCell>{index+1}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.enrolment}</TableCell>
            <TableCell>{row.branch}</TableCell>
            <TableCell>{row.phone}</TableCell>
            <TableCell>{row.email}</TableCell>
            </TableRow>
        ))}
        </TableBody>

        <TableFooter>
            <TableRow>
                <TablePagination rowsPerPageOptions={[3,5,10]}
                count={candidate_list.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}/>
            </TableRow>
        </TableFooter>
        </>        
        
    )
}