import React,{useEffect} from 'react';
import { TableContainer,Divider,Table,TableHead,Checkbox,Menu,TableRow,TableCell,Typography, TableBody,TableFooter,TablePagination, FormControl, Select,InputLabel, TextField, Button,Modal, MenuItem} from '@mui/material';
import axios from 'axios';
import { Box, height } from '@mui/system';
import { FormLabel,RadioGroup,Radio,FormControlLabel } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import Input from "@material-ui/core/Input";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken'

export default function InterviewTable(props)
{
    const {int_rounds,index,img_year,season_id,ws}=props


    if(img_year>2)
    var headers=[{value:'Sl No'},{value:"Name"},{value:'Phone'},{value:'Status'},{value:'Call Notes'},{value:'PanelID'},{value:'Slot Timings'},{value:'Marks'},{value:'Remarks'}]
    else
    var headers=[{value:'Sl No'},{value:"Name"},{value:'Phone'},{value:'Status'},{value:'Call Notes'},{value:'PanelID'},{value:'Slot Timings'}]



    return(<>
        <TableContainer>
        <Table>
        <TableHead>
            <TableRow>
            <TableCell padding="checkbox"></TableCell>
            {headers.map((header)=>(
                    <TableCell>
                        <Typography sx={{fontWeight:'bold', fontSize:20}}>
                           {header.value}
                           </Typography>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>

        <InterviewTableBody  this_round_id={int_rounds[index].id} int_rounds={int_rounds} img_year={img_year} season_id={season_id} index={index} ws={ws}/>
        </Table>
        </TableContainer>
        </>
    )
}




function InterviewTableBody(props){

    const {this_round_id, int_rounds,img_year,season_id,index,ws}=props

    const [reload,setReload]=React.useState(false)
    const [rows,setRows]=React.useState([])
    const [filteredRows,setFilteredRows]=React.useState([])
    const [panels,setPanels]=React.useState()
    useEffect(()=>{
        axios
        .get("http://localhost:8000/interview_panel/get_panels/",{params:{season_id:season_id}},{withCredentials:true})
        .then(function(response){
            setPanels(response.data)
        })
        axios
        .get("http://localhost:8000/int_rounds/get_info/",{params:{int_round_id:int_rounds[index].id}})
        .then(function(response){
            setRows(response.data)
            setFilteredRows(response.data)
        })
        setRadioValue('All')
        setFilterMarks()
    },[reload,index])



    ws.onmessage=function(e){
        if(JSON.parse(e.data)['message']=='updated')
        setReload(!reload)
    }


    //filter
    const [openF, setOpenF] = React.useState(false);
    const openFilter = () => setOpenF(true);
    const closeFilter = () => {setOpenF(false);setRadioValue('All');setFilterMarks()}    
    const [radioValue,setRadioValue]=React.useState('All')
    const [filterMarks,setFilterMarks]=React.useState()
    const handleRadioChange=(event)=>{
        setRadioValue(event.target.value)
    }
    const changeMarksFilter=(event)=>{
        setFilterMarks(event.target.value)
    }
    const applyFilter=()=>{
        let localFilteredRows=[]
        if(radioValue=='All')
        localFilteredRows=rows
        else
        {
            for(let i=0;i<rows.length;i++)
            {
                if(rows[i].status==radioValue)
                localFilteredRows.push(rows[i])
            }
        }
        let fR=localFilteredRows
        localFilteredRows=[]
        for(let i=0;i<fR.length;i++)
        {
            if(filterMarks==null || (fR[i].marks>filterMarks))
            localFilteredRows.push(fR[i])
        }
        setFilteredRows(localFilteredRows)
        closeFilter()
        setFilterMarks(filterMarks)
        setRadioValue(radioValue)
    }
    const resetFilter=()=>{
        closeFilter()
        setFilteredRows(rows)
    }



    //page numbering
    const [page,setPage]=React.useState(0);
    const[rowsPerPage,setRowsPerPage]=React.useState(5);
    const handleChangePage=(event,newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
      };



    
    
    //update rows detail
    let [status,setStatus]=React.useState(null)
    let [callNotes,setCallNotes]=React.useState('')
    let [timing,setTiming]=React.useState('')
    let [marks,setMarks]=React.useState('');
    let [remarks,setRemarks]=React.useState('');
    const [rowID,setRowID]=React.useState(-1);
    let [panelID,setPanelID]=React.useState('');

    const [openModal,setOpenModal]=React.useState(false)
    const handleOpenModal= (id,status,callNotes,marks,remarks,p_id,timing) => {setOpenModal(true);setRowID(id);setStatus(status);setCallNotes(callNotes);setMarks(marks);setPanelID(p_id);setRemarks(remarks);setTiming(timing);console.log(p_id)};
    const handleClose = () => {setOpenModal(false);setRowID(-1);setStatus(null);setCallNotes('');setMarks('');setPanelID('');setRemarks('');setTiming('');};
    const handleStatusChange=(event)=>{
        setStatus(event.target.value)
    }
    const handleCallNotesChange=(event)=>{
        setCallNotes(event.target.value)
    }
    const handleTimingChange=(event)=>{
        setTiming(event.target.value)
    }
    const handlePanelID=(event)=>{
        setPanelID(event.target.value)
    }
    const handleMarksChange=(event)=>{
        setMarks(event.target.value)
    }
    const handleRemarksChange=(event)=>{
        setRemarks(event.target.value)
    }
    const changeMarksRemarks=(marks,remarks)=>{
        if(marks=="")
        marks=null
        const params=JSON.stringify({"marks":marks,"remarks":remarks,"interview_id":rowID,"status":status,"callNotes":callNotes,"panelID":panelID,"timing":timing});
        axios
        .post("http://localhost:8000/interviewresponse/update_marks/",params,{headers:{"Content-Type":"application/json"}},{withCredentials:true})
        .then(function(response){
            handleClose()
            ws.send(JSON.stringify({"message":"updated"})) 
        })     
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
        setSelected(newSelected);
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
    const moveToTest=()=>{
        for(let i=0;i<selected.length;i++)
        {
            const params=JSON.stringify({"id":selected[i]})
            axios
            .post("http://localhost:8000/candidate_season_data/move_to_test/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
            .then(function(response){
                ws.send(JSON.stringify({"message":"updated"}))
                handleCloseMenu()
            })
        }
        
    }
    const moveToSelected=()=>{
        for(let i=0;i<selected.length;i++)
        {
            const params=JSON.stringify({"id":selected[i]})
            axios
            .post("http://localhost:8000/candidate_season_data/move_to_selected/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
            .then(function(response){
                ws.send(JSON.stringify({"message":"updated"}))
                handleCloseMenu()
            })
        }

    }
    const moveToInterview=(round_id)=>{
        for(let i=0;i<selected.length;i++)
        {
            const params=JSON.stringify({"candidate_id":selected[i],"round_id":round_id})
            axios
            .post("http://localhost:8000/candidate_season_data/move_to_interview/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
            .then(function(response){
                ws.send(JSON.stringify({"message":"updated"}))
                handleCloseMenu()
            })
        }
    }





    return(
        <>
        <Button variant="contained" sx={{position:"absolute", right:'5vw',top:'28vh',width:'10vw'}} startIcon={<FilterListIcon />} onClick={openFilter}>Filter</Button>
        <Modal open={openF} onClose={closeFilter}>
            <Box sx={{height:"30vh", width:"30vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"30%",right:"5.5vw", p:3,borderRadius:2.5}}>
            <Typography variant="h5" sx={{fontWeight:'bold'}}>Filters</Typography>
                <br />

                <Divider />
                <div style={{marginBottom:10, marginTop:10}}>
                <FormControl>
                    <FormLabel>Evaluation Status</FormLabel>
                    <RadioGroup row value={radioValue} onChange={handleRadioChange}>
                        <FormControlLabel value="All" control={<Radio />} label="All"/>
                        <FormControlLabel value="Called" control={<Radio />} label="Called"/>
                        <FormControlLabel value="Not Called" control={<Radio />} label="Not Called"/>
                        <FormControlLabel value="Ongoing" control={<Radio />} label="Ongoing"/>
                        <FormControlLabel value="Waiting" control={<Radio />} label="Waiting"/>
                        <FormControlLabel value="Done" control={<Radio />} label="Done"/>
                    </RadioGroup>
                </FormControl>
                </div>
                {img_year>2 &&
                <>
                <Divider />
                <div style={{marginBottom:20, marginTop:10}}>
                <FormControl>
                    <FormLabel>Marks (Greater than)</FormLabel>
                    {/* <div style={{display:'inline-block'}}>
                        <input type="number" defaultValue={filterMarks} style={{width:'2vw'}} onChange={changeMarksFilter}  />
                    </div> */}
                    <Input type="number"  defaultValue={filterMarks} onChange={changeMarksFilter} />
                </FormControl>
                </div>
                </>
                }
                
                <Button onClick={applyFilter} variant="contained" sx={{position:"absolute", right:'8vw'}}>Apply</Button>
                <Button onClick={resetFilter} variant="outlined" sx={{position:"absolute", right:'3vw'}}>Reset</Button>
            </Box>
            </Modal>





        <TableBody>
            {(filteredRows.slice(page*rowsPerPage,(page+1)*rowsPerPage)).map((row,index)=>{
                const isItemSelected = isSelected(row.candidate_id);
                return(
            <TableRow hover selected={isItemSelected}  onClick={(event) => handleClick(event, row.candidate_id)} sx={{cursor:'pointer'}}>          
            <TableCell padding="checkbox"><Checkbox checked={isItemSelected}/></TableCell>
            <TableCell>{index+1}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.phone}</TableCell>
            <TableCell onClick={()=>{handleOpenModal(row.id,row.status,row.call_notes,row.marks,row.remarks,row.panelID,row.slot_timing)}} >{row.status}</TableCell>
            <TableCell onClick={()=>{handleOpenModal(row.id,row.status,row.call_notes,row.marks,row.remarks,row.panelID,row.slot_timing)}} >{row.call_notes}</TableCell>
            <TableCell onClick={()=>{handleOpenModal(row.id,row.status,row.call_notes,row.marks,row.remarks,row.panelID,row.slot_timing)}}>{row.panelID}</TableCell>
            <TableCell onClick={()=>{handleOpenModal(row.id,row.status,row.call_notes,row.marks,row.remarks,row.panelID,row.slot_timing)}} >{row.slot_timing && row.slot_timing.substring(0,10)+" / "+row.slot_timing.substring(11,19)}</TableCell>
            {img_year>2 &&
            <>
            <TableCell onClick={()=>{handleOpenModal(row.id,row.status,row.call_notes,row.marks,row.remarks,row.panelID,row.slot_timing)}} >{row.marks}</TableCell>
            <TableCell onClick={()=>{handleOpenModal(row.id,row.status,row.call_notes,row.marks,row.remarks,row.panelID,row.slot_timing)}} >{row.remarks}</TableCell>          
            </>
            }
            </TableRow>
            )})}
        </TableBody>




        <TableFooter>
        <Button variant="contained" sx={{height:'4h', width:'10vw', mt:2}} onClick={openMenu}>Move to  Round</Button>
                <Menu open={open} anchorEl={anchorEl} onClose={handleCloseMenu} >
                    <MenuItem onClick={()=>{moveToTest()}}>Test Round / Project</MenuItem>
                    {int_rounds.map((round,index)=>{
                        return round.id!=this_round_id?
                    <MenuItem onClick={()=>{moveToInterview(round.id)}}>Interview Round {index+1}</MenuItem>:null
                    })}
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





        <Modal open={openModal} onClose={handleClose}>
            <Box sx={{height:"60vh", width:"20vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3,borderRadius:2.5}}>
                <Typography sx={{mb:3,fontSize:20,fontWeight:'bold'}}>Update Interview Details</Typography>
                <br />
                <FormControl sx={{mb:3}}>
                    <InputLabel id="int_status">Interview Status</InputLabel>
                    <Select labelID="int_status" label="Interview Status" defaultValue={status} onChange={handleStatusChange} sx={{width:'20vw'}}>
                        <MenuItem value="Called">Called</MenuItem>
                        <MenuItem value="Not Called">Not Called</MenuItem>
                        <MenuItem value="Ongoing">Ongoing</MenuItem>
                        <MenuItem value="Waiting">Waiting</MenuItem>
                        <MenuItem value="Done">Done</MenuItem>
                    </Select>
                </FormControl>
                <br />
                <FormControl sx={{mb:3}}>
                    <TextField label="Enter Call Notes" defaultValue={callNotes} onChange={handleCallNotesChange} sx={{width:'20vw'}}/>
                </FormControl>
                
                <FormControl sx={{mb:3}}>
                    <InputLabel id="panel_id">Panel ID</InputLabel>
                    <Select labelID="panel_id" label="Panel ID" value={panelID} onChange={handlePanelID} sx={{width:'20vw'}}>
                        {panels && panels.map((panel)=>(
                            <MenuItem value={panel}>{panel}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <br /><br />
                <FormControl sx={{mb:3}}>
                    <TextField label="Slot-Timing" type="datetime-local" onChange={handleTimingChange} InputLabelProps={{shrink: true,}} sx={{width:'20vw'}}/>                    
                </FormControl>

                {img_year>2 &&
                <>
                <FormControl sx={{mb:3}}>
                    <TextField label="Enter Marks" type="number" defaultValue={marks} onChange={handleMarksChange} sx={{width:'20vw'}}/>
                </FormControl>
                <FormControl>
                    <TextField label="Enter Remarks" defaultValue={remarks} onChange={handleRemarksChange} sx={{width:'20vw'}}/>
                </FormControl>
                </>
                }

                <Button variant="contained" sx={{position:"absolute", right:"2vw", bottom:'2vh'}} onClick={()=>{changeMarksRemarks(marks,remarks)}}>Update</Button>
            </Box>
            </Modal>         

                

        </>
    )
}