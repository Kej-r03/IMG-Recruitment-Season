import { ThemeProvider, Button,Typography,Link,Breadcrumbs,createTheme,AppBar, Paper,Table, TablePagination,TableFooter, Toolbar,Box,Tabs,Tab,Divider, TableContainer, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Checkbox } from "@mui/material";
import React from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddIcon from '@mui/icons-material/Add';

const theme=createTheme({
    palette:{   
        primary: {
            main:"rgb(30, 86, 125)",
        },
    },
})
const breadcrumbs=["Home","Dashboard"];
export default function Dashboard(){
    return(
        <ThemeProvider theme={theme}>
            
            <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height:'5.5vh' }}>
                <Toolbar>
                    
                <Typography variant="h6" sx={{flexGrow:1}} textAlign="center">
                
                    Dashboard
                    
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
                <Typography variant="h4" sx={{ml:4,mb:5}}>
                    IMG Recruitment '22
                </Typography>
                <Box>
                    <RoundTab />
                    <TableMain />
                </Box>
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

const rounds=[1,2,3];

function RoundTab(){
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
               {rounds.map((round) => (
                   
                   <Tab label={`Round ${round}`} sx={{ml:3}}/>
                   
               ))}
          </Tabs>
          {/* <Button variant="outlined" startIcon={<AddIcon />} sx={{position:"absolute", right:"25%"}}>Add Round</Button> */}
          <SearchOutlinedIcon sx={{positon:"absolute",right:"10vw"}}/>
        </Toolbar>
        
        <Divider />
        </>
    )
}






const headCells=[{id:"name"},{id: "calories"},{id:"fat"},{id:"Evaluation Status"},{id:"Section 1"},{id:"Section 2"}]

function TableMain(){

    const [order,setOrder]=React.useState('asc');//variable to store whether to sort by ascending order or descending order
    const [orderBy,setOrderBy]=React.useState("Sl No");//variable to store column as per which table is sorted

    let orderedRows=rows;

    function createSortHandler(property){
        const isAsc= orderBy === property && order==='asc';
        setOrder(isAsc?'desc':'asc');
        setOrderBy(property);
        orderedRows=rows.sort((a,b)=>{
            let ans=0;
            if(a[orderBy]>b[orderBy])
            ans=-1;
            else
            ans=1;

            if(order==='asc')
            return ans;
            else
            return -ans;
        })
        console.log(orderBy);
        console.log(order);
    }


    return(
        <TableContainer>
        <Table>

        <TableHead>
            <TableRow>
                <TableCell padding="checkbox"></TableCell>
                {headCells.map((header)=>(
                    <TableCell>
                       <TableSortLabel 
                       active={orderBy === header.id} //shows which column head is sorted
                       direction={orderBy===header.id?order:'asc'} //if sorting is done as per the header column, order it in the given sense, else in ascending order
                       onClick={()=>{createSortHandler(header.id)}}
                       >
                           {header.id}
                        </TableSortLabel> 
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>

        <EnhancedTableBody orderedRows={orderedRows}/>

        </Table>
        </TableContainer>
    )
}

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

function EnhancedTableBody(props){
    const {orderedRows}=props;
    const [page,setPage]=React.useState(0);
    const[rowsPerPage,setRowsPerPage]=React.useState(2);

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
            <TableCell padding="checkbox"><Checkbox /></TableCell>
            <TableCell>{index+1}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.calories}</TableCell>
            <TableCell>{row.fat}</TableCell>
            <TableCell>{row.carbs}</TableCell>
            <TableCell>{row.protein}</TableCell>
            </TableRow>
        ))}
        </TableBody>

        <TableFooter>
            <TableRow>
                <TablePagination rowsPerPageOptions={[2,3,5]}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}/>
            </TableRow>
        </TableFooter>
        </>        
        
    )
}

