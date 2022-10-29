import { TableContainer, Table,TableCell,Checkbox,Menu,MenuItem, Modal,FormLabel,TableBody,TablePagination,FormControl,Button, TableHead, TableRow, Typography, TableFooter,TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect } from "react";
import FilterListIcon from '@mui/icons-material/FilterList';


axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken'



export default function Project(props)
{
    const {int_rounds,season_id,img_year}=props
    const [rows,setRows]=React.useState([])
    useEffect(()=>{
        axios
        .get("http://localhost:8000/candidate_season_data/get_project_info/",{params:{season_id:season_id}},{withCredentials:true})
        .then(function(response){
            setRows(response.data)
            setFilteredRows(response.data)
        })
    },[])

    
    if(img_year>2)
    var headCells=[{id:'slno',value:"Sl No"},{id:'name',value:'Name'},{id:'enrolment',value:'Enrolment No'},{id:'project_name',value:'Project Name'},{id:'marks',value:'Marks'},{id:'remarks',value:'Remarks'}]
    else
    var headCells=[{id:'slno',value:"Sl No"},{id:'name',value:'Name'},{id:'enrolment',value:'Enrolment No'},{id:'project_name',value:'Project Name'}]



    //filter
    const [open, setOpen] = React.useState(false);
    const openFilter = () => setOpen(true);
    const closeFilter = () => {setOpen(false);setFilterMarks()}
    const [filterMarks,setFilterMarks]=React.useState()
    const [filteredRows,setFilteredRows]=React.useState([])
    const changeMarksFilter=(event)=>{
        setFilterMarks(event.target.value)
    }
    const applyFilter=()=>{
        let localFilteredRows=[]
        for(let i=0;i<rows.length;i++)
        {
            if(filterMarks==null || (rows[i].marks>filterMarks))
            localFilteredRows.push(rows[i])
        }
        setFilteredRows(localFilteredRows)
        closeFilter()
        setFilterMarks(filterMarks)
    }
    const resetFilter=()=>{
        closeFilter()
        setFilteredRows(rows)
    }
    return(
        <>
        {img_year>2 && <Button variant="contained" sx={{position:"absolute", right:'5vw',top:'28vh',width:'10vw'}} startIcon={<FilterListIcon />} onClick={openFilter}>Filter</Button>}

            <Modal open={open} onClose={closeFilter}>
            <Box sx={{height:"15vh", width:"10vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"30%",right:"5.5vw", p:3}}>

                <Typography sx={{fontWeight:'bold'}}>Filters</Typography>

                {img_year>2 && 
                <>
                <FormLabel>Marks</FormLabel><br />
                    <FormControl>
                        Greater than <input type="number" style={{width:'2vw'}} defaultValue={filterMarks} onChange={(event)=>{changeMarksFilter(event)}}  />
                    </FormControl>
                </>
                }

                <Button variant="contained" onClick={applyFilter} sx={{position:"absolute", right:'7vw', bottom:'2vh'}}>Apply</Button>
                <Button variant="contained" onClick={resetFilter} sx={{position:"absolute", right:'2vw', bottom:'2vh'}}>Reset</Button>
                
            </Box>
            </Modal>


        <TableContainer>
            <Table>
                <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox"></TableCell>
                            {headCells.map((header)=>(
                                <TableCell><Typography sx={{fontWeight:'bold', fontSize:20}}>{header.value}</Typography></TableCell>
                            ))}
                        </TableRow>
                </TableHead>
                <ProjectTableBody rows={filteredRows} int_rounds={int_rounds} img_year={img_year}/>
            </Table>
        </TableContainer>
        </>
    )
}


function ProjectTableBody(props){
    const {rows,int_rounds,img_year}=props

    const [page,setPage]=React.useState(0);
    const[rowsPerPage,setRowsPerPage]=React.useState(5);
    const handleChangePage=(event,newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
      };




    const [openModal,setOpenModal]=React.useState(false)
    const [openModalValue,setOpenModalValue]=React.useState(-1)
    const handleOpenModal=(id)=>{setOpenModal(true);setOpenModalValue(id)}
    const handleCloseModal =()=>{setOpenModal(false);setOpenModalValue(-1);setProjectID();setMarks();setRemarks();setDetails('');setProjectName('')}
    let [marks,setMarks]=React.useState()
    const [remarks,setRemarks]=React.useState('')
    const [details,setDetails]=React.useState('')
    const [projectName,setProjectName]=React.useState('')
    const [projectID,setProjectID]=React.useState()
    const handleMarksChange=(event)=>{setMarks(event.target.value)}
    const handleRemarksChange=(event)=>{setRemarks(event.target.value)}
    const changeMarksRemarks=()=>{
        if(marks=="")
        marks=null
        const params={marks:marks,remarks:remarks,details:details,project_name:projectName}
        let url="http://localhost:8000/project/"+projectID+"/"
        axios
        .put(url,params,{headers:{"Acess-Control-Allow-Methods":"PUT"}},{withCredentials:true})
        handleCloseModal()
        window.location.href=window.location.href  
    }




    //move to menu
    const [selected,setSelected]=React.useState([])
    const isSelected = (id) => selected.indexOf(id) !== -1;
    const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    
    if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
        );
    }
    setSelected(newSelected)
    };
    const [open,setOpen]=React.useState(false)
    const [anchorEl,setAnchorEl]=React.useState(null)
    const openMenu=(event)=>{
        setOpen(!open)
        setAnchorEl(event.currentTarget)
    }
    const handleCloseMenu=()=>{
        setAnchorEl(null)
        setOpen(false)
    }
    const moveToSelected=()=>{
        for(let i=0;i<selected.length;i++)
        {
            const params=JSON.stringify({"id":selected[i]})
            axios
            .post("http://localhost:8000/candidate_season_data/move_to_selected/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        }
        window.location.href=window.location.href

    }
    const moveToInterview=(round_id)=>{
        for(let i=0;i<selected.length;i++)
        {
            const params=JSON.stringify({"candidate_id":selected[i],"round_id":round_id})
            axios
            .post("http://localhost:8000/candidate_season_data/move_to_interview/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        }
        window.location.href=window.location.href
    }
    return(
        <>
        <TableBody>
            {(rows.slice(page*rowsPerPage,(page+1)*rowsPerPage)).map((row,index)=>{
                 const isItemSelected = isSelected(row.id);
                 return(
                     <>
                     
                  {/* <TableRow hover selected={isItemSelected}  onClick={(event) => handleClick(event, row.id)}> */}
                
                <TableRow hover selected={isItemSelected}  sx={{cursor:'pointer'}}>
                    <TableCell padding="checkbox" onClick={(event)=>handleClick(event, row.id)}><Checkbox checked={isItemSelected}/></TableCell>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.enrolment}</TableCell>
                    <TableCell onClick={()=>{handleOpenModal(row.id);setProjectID(row.project_name_id);setMarks(row.marks);setRemarks(row.remarks);setProjectName(row.project_name);setDetails(row.project_details)}}>{row.project_name}</TableCell>
                    {img_year>2 &&
                    <>
                    <TableCell onClick={()=>{handleOpenModal(row.id);setProjectID(row.project_name_id);setMarks(row.marks);setRemarks(row.remarks);setProjectName(row.project_name);setDetails(row.project_details)}}>{row.marks}</TableCell>
                    <TableCell onClick={()=>{handleOpenModal(row.id);setProjectID(row.project_name_id);setMarks(row.marks);setRemarks(row.remarks);setProjectName(row.project_name);setDetails(row.project_details)}}>{row.remarks}</TableCell>
                    </>
                    }
                </TableRow>



                <Modal open={openModal && row.id==openModalValue} onClose={handleCloseModal}>
                    <Box sx={{height:"42vh", width:"20vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>
                    <Typography sx={{mb:3,fontSize:20,fontWeight:'bold'}}>Project Details</Typography>

                    <FormControl sx={{mb:3}}>
                    <Typography>Project Details</Typography>
                    <TextField type='text' value={row.project_details} variant='outlined' inputProps={{ readOnly: true, }}/>
                    </FormControl>
                    
                    {img_year>2 && <>
                    <FormControl sx={{mb:3}}>
                    <Typography>Enter Marks</Typography>
                    <input type="number" defaultValue={row.marks} onChange={handleMarksChange}/>
                    </FormControl>

                    <FormControl>
                    <Typography>Enter Remarks</Typography>
                    <TextField defaultValue={row.remarks} onChange={handleRemarksChange} />
                    </FormControl>

                    <Button variant="contained" sx={{position:"absolute", right:"2vw", bottom:'2vh'}} onClick={changeMarksRemarks}>Submit</Button>
                    </>
                    }
                    </Box>
                </Modal>


                </>
            )})}
        </TableBody>

        <TableFooter>
        <Button variant="contained" sx={{height:'4vh', width:'10vw', mt:2}} onClick={openMenu}>Move to  Round</Button>
                <Menu open={open} anchorEl={anchorEl} onClose={handleCloseMenu} >
                    {int_rounds.map((round,index)=>(
                    <MenuItem onClick={()=>{moveToInterview(round.id)}}>Interview Round {index+1}</MenuItem>
                    ))}
                    <MenuItem onClick={()=>{moveToSelected()}}>Selected</MenuItem>
                </Menu>
                
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