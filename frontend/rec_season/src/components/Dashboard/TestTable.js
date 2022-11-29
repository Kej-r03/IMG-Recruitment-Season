import React,{useEffect} from "react"
import { ThemeProvider,IconButton,Menu,MenuItem,Modal, TextField,Button,Typography,Link,Breadcrumbs,createTheme,AppBar, Paper,Table, TablePagination,TableFooter, Toolbar,Box,Tabs,Tab,Divider, TableContainer, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Checkbox, FormLabel, Radio,RadioGroup, FormControlLabel ,FormControl} from "@mui/material";
import axios from "axios";
import FilterListIcon from '@mui/icons-material/FilterList';
import Input from "@material-ui/core/Input";
import $ from 'jquery';


const headCells=[{id:"slno",value:"Sl No"},{id:"name",value:"Name"},{id: "enrolment",value:"Enrolment No"},{id:"eval_status",value:'Evaluation Status'}]
//NOTE: id must be same as objects' keys
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken'

export default function TestTable(props){

    const {value,test_papers,int_rounds,img_year,ws}=props 


    const [testSections,setTestSections]=React.useState([])
    
    useEffect(()=>{
            axios
            .get("http://localhost:8000/testsection/get_sections/",{params:{paper_id:test_papers[value].id}},{withCredentials:true})
            .then(function(response){
                setTestSections(response.data)
            })        
    },[value]) 

    

    return(<>
        <TableContainer>
        <Table>

        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" rowSpan={2}></TableCell>
                {headCells.map((header)=>(
                    <TableCell rowSpan={2}>
                        <Typography sx={{fontWeight:'bold', fontSize:20}}>
                           {header.value}
                           </Typography>
                    </TableCell>
                ))}

                {img_year>2 && testSections.map((section)=>(
                    <TableCell colSpan={section.ques_list.length+1} align="center">
                    <Typography sx={{fontWeight:'bold', fontSize:20}}>
                       {section.section_name}
                       </Typography>
                </TableCell>
                ))}
            </TableRow>


            {img_year>2 && <TableRow>
                {testSections.map((section)=>(
                    <>
                    {section.ques_list.map((question)=>(
                    <TableCell>
                        <Typography sx={{fontWeight:'bold', fontSize:15}} align="center">
                        <span title={question.q_text}>Q_ID{question.q_id}</span>
                        </Typography>
                    </TableCell>
                    ))}
                    <TableCell>
                        <Typography sx={{fontWeight:'bold', fontSize:20}} align="center">
                        Total
                        </Typography>
                    </TableCell>
                    </>
                ))}

            </TableRow>  
            }          
        </TableHead>

        <EnhancedTableBody value={value} testSections={testSections} int_rounds={int_rounds} img_year={img_year} test_papers={test_papers} ws={ws} />
        </Table>
        </TableContainer>
        </>
    )
}


function EnhancedTableBody(props){ //ordered rows and filtered rows are same at every point...ordered rws
    let {value,testSections,int_rounds,img_year,test_papers,ws}=props;   

    const [reload,setReload]=React.useState(false)
    const [rows,setRows]=React.useState()//original rows
    let [filteredRows,setFilteredRows]=React.useState()//rows after filtering
    let [orderedRows,setOrderedRows]=React.useState()// rows after ordering
    useEffect(()=>{
        axios
        .get("http://localhost:8000/candidate_season_data/get_marks/",{params:{paper_id:test_papers[value].id}},{withCredentials:true})
        .then(function(response){
            setRows(response.data)
            setFilteredRows(response.data)
            setOrderedRows(response.data)
        })
        reset()
    },[reload,value])


    

    //filter settings
    const [openF, setOpenF] = React.useState(false);
    const openFilter = () => setOpenF(true);
    const closeFilter = () => {setOpenF(false);}

    const [radioValue,setRadioValue]=React.useState('All')
    const handleRadioChange=(event)=>{
        setRadioValue(event.target.value)
    }
    const [sectionValue,setSectionValue]=React.useState([])//array of objects, stores data for each filter applied on total section marks
    const changeSectionFilter=(event,id)=>{
        let index=-1;
        for(let i=0;i<sectionValue.length;i++)
        {
            if(sectionValue[i].id==id)
            {
                index=i;
                break;
            }
        }
        if(event.target.value.length==0)
        {
            if(index!=-1)
            sectionValue.splice(index,1)
        }
        else
        {
            if(index==-1)
            {
                let obj={id:id,value:event.target.value}
                sectionValue.push(obj)
            }
            else
            {
                sectionValue[index].value=event.target.value
            }
        }
    }

    const getDefaultSectionValue=(id)=>{ //used for setting default value in section filters
        let index=-1
        for(let i=0;i<sectionValue.length;i++)
        {
            if(sectionValue[i].id==id)
            return sectionValue[i].value
        }
    }
    const applyFilter=()=>{
        
        let radioFilteredrows=[]
        if(radioValue=='All')
        radioFilteredrows=rows
        else
        {
            for(let i=0;i<rows.length;i++)
            if(rows[i].eval_status==radioValue)
            radioFilteredrows.push(rows[i])
        }
        if(radioFilteredrows.length!=0)
        for(let i=0;i<sectionValue.length;i++)
        {
            let section_id_index=-1
            for(let j=0;j<radioFilteredrows[0].section_total_list.length;j++)//this loop calculates that index of section_total_list whose section_id is equal to that of the filter
            {
                if(radioFilteredrows[0].section_total_list[j].section_id==sectionValue[i].id)
                {
                    section_id_index=j;
                    break;
                }
            }

            let filteredRow=[]

            for(let j=0;j<radioFilteredrows.length;j++)//recursively stores filtered rows as per each section in filteredRow[] and stores it into radioFilteredrows[]
            {
                if(radioFilteredrows[j].section_total_list[section_id_index].total>sectionValue[i].value)
                filteredRow.push(radioFilteredrows[j])
            }
            radioFilteredrows=filteredRow
        }
        closeFilter()
        setFilteredRows(radioFilteredrows)
        setOrderedRows(radioFilteredrows)
    }

    const reset=()=>{
        setFilteredRows(rows)
        setOrderedRows(rows)
        setRadioValue('All')
        setSectionValue([])
        closeFilter()
    }










    //handle page number
    const [page,setPage]=React.useState(0);
    const[rowsPerPage,setRowsPerPage]=React.useState(5);

    const handleChangePage=(event,newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };







    //update marks and remarks
    let [marks,setMarks]=React.useState('');
    const [remarks,setRemarks]=React.useState('');
    const [quesID,setQuesID]=React.useState()
    const [candidateID,setCandidateID]=React.useState()
    const [openModal,setOpenModal]=React.useState(false)
    const handleOpenModal= (id,candidateSeason_id) => {setOpenModal(true);setQuesID(id);setCandidateID(candidateSeason_id)};
    const handleCloseModal = () => {setOpenModal(false);setQuesID();setCandidateID();setMarks('');setRemarks('');};
    const handleMarksChange=(event)=>{
        setMarks(event.target.value)
    }
    const handleRemarksChange=(event)=>{
        setRemarks(event.target.value)
    }
    const changeMarksRemarks=(marks,remarks)=>{
        if(marks=="")
        marks=null
        const params=JSON.stringify({"marks":marks,"remarks":remarks,"ques_id":quesID,"candidate_season_id":candidateID});
        axios
        .post("http://localhost:8000/testresponse/update_marks/",params,{headers:{"Content-Type":"application/json"}},{withCredentials:true})        
        .then(function(response){
        ws.send(JSON.stringify({"message":"updated"}))
        handleCloseModal()
        axios
        .get("http://localhost:8000/candidate_season_data/get_marks/",{params:{paper_id:test_papers[value].id}},{withCredentials:true})
        .then(function(response){
            // setReload(!reload)
        })
        })        
    }
    ws.onmessage=function(e){
        if(JSON.parse(e.data)['message']=='updated')
        setReload(!reload)
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
    const moveToSelected=()=>{
        
        for(let i=0;i<selected.length;i++)
        {
            const params=JSON.stringify({"id":selected[i]})
            axios
            .post("http://localhost:8000/candidate_season_data/move_to_selected/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
            .then(function(response){
                ws.send(JSON.stringify({"message":"updated"}))
                handleCloseMenu()
                setReload(!reload)
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
                setReload(!reload)
            })
        }
        
    }

    return(      
        <>  
            <Button variant="contained" sx={{position:"absolute", right:'5vw',top:'28vh',width:'10vw'}} startIcon={<FilterListIcon />} onClick={openFilter}>Filter</Button>
            <Modal open={openF} onClose={closeFilter}>
            <Box sx={{height:"40vh", width:"20vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"30%",right:"5.5vw", p:3,borderRadius:2.5}}>

                <Typography variant="h5" sx={{fontWeight:'bold'}}>Filters</Typography>
                <br />

                <Divider />
                <div style={{marginBottom:10, marginTop:10}}>
                <FormControl>
                    <FormLabel>Evaluation Status</FormLabel>
                    <RadioGroup row value={radioValue} onChange={handleRadioChange}>
                        <FormControlLabel value="All" control={<Radio />} label="All"/>
                        <FormControlLabel value="Evaluated" control={<Radio />} label="Evaluated"/>
                        <FormControlLabel value="Not Evaluated" control={<Radio />} label="Not Evaluated"/>
                    </RadioGroup>
                </FormControl>
                </div>

                {img_year>2 &&
                <>
                <Divider />
                <div style={{marginBottom:20, marginTop:10}}>
                <FormLabel sx={{mb:50}}>Marks (Greater than)</FormLabel><br />
                {testSections.map((section)=>(
                    <div>
                    <FormControl>
                        <div style={{display:'inline-block',marginTop:10}}>
                        {/* Greater than <input type="number"  style={{width:'2vw'}} onChange={(event)=>{changeSectionFilter(event,section.id)}} defaultValue={getDefaultSectionValue(section.id)} /> for {section.section_name} */}
                        <Input type="number"  style={{width:'5vw',pb:10}} onChange={(event)=>{changeSectionFilter(event,section.id)}} defaultValue={getDefaultSectionValue(section.id)} sx={{ml:20}}/> for {section.section_name}
                        </div>
                    </FormControl>
                </div>
                ))}
                </div>
                </>
                }

                <Button variant="contained" sx={{position:'absolute', bottom:'2vh', left:'12vw'}} onClick={applyFilter}>Apply</Button>
                <Button variant="outlined" sx={{position:'absolute', bottom:'2vh', left:'17vw'}} onClick={reset}>Reset</Button>
                
            </Box>
            </Modal>






        <TableBody>
        {orderedRows && (orderedRows.slice(page*rowsPerPage,(page+1)*rowsPerPage)).map((row,index)=>{
            const isItemSelected = isSelected(row.id);
            return(
            <TableRow hover selected={isItemSelected}  onClick={(event) => handleClick(event, row.id)}>          
            <TableCell padding="checkbox"><Checkbox checked={isItemSelected}/></TableCell>
            <TableCell>{index+1}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.enrolment}</TableCell>
            <TableCell>{row.eval_status}</TableCell>          
            {img_year>2 && testSections.map((section)=>(
                <>
                {section.ques_list.map((ques)=>(
                    <TableCell align="center" onClick={()=>{handleOpenModal(ques.id,row.id)}} sx={{cursor:'pointer'}}>
                    {row.mark_list.map((mark,index)=>(
                        <>
                        {mark[0]==ques.id?<div title={mark[2]}>{mark[1]}</div>:null}                         
                        </>
                    ))}
                    </TableCell>
                ))}
                <TableCell align="center" sx={{fontWeight:'bold'}}>
                    {row.section_total_list.map((total)=>(
                        section.id==total.section_id?<div>{total.total}</div>:null
                    ))}
                </TableCell>
                </>
            ))} 



            <Modal open={openModal} onClose={handleCloseModal}>
            <Box sx={{height:"20vh", width:"20vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3,borderRadius:2.5}}>
                <Typography sx={{mb:3,fontSize:20,fontWeight:'bold'}}>Q_ID{quesID}</Typography>
                <FormControl sx={{mb:3}}>
                    <TextField label={"Enter New Marks"} type="number" required onChange={handleMarksChange} />
                </FormControl>
                <FormControl>
                    <TextField label={"Enter New Remarks"} onChange={handleRemarksChange} />
                </FormControl>

                <Button variant="contained" sx={{position:"absolute", right:"2vw", bottom:'2vh'}} onClick={()=>{changeMarksRemarks(marks,remarks)}}>Submit</Button>
            </Box>
            </Modal>

            
            </TableRow>            
        )})}
        </TableBody>
        




        {orderedRows && <TableFooter  sx={{pt:3}}>   
        <Button variant="contained" sx={{height:'4vh', width:'10vw',mt:2}} onClick={openMenu}>Move to  Round</Button>
                <Menu open={open} anchorEl={anchorEl} onClose={handleCloseMenu} >
                    {int_rounds.map((round,index)=>(
                    <MenuItem onClick={()=>{moveToInterview(round.id)}}>Interview Round {index+1}</MenuItem>
                    ))}
                    <MenuItem onClick={()=>{moveToSelected()}}>Selected</MenuItem>
                </Menu>     
            <TableRow>
           
                <TablePagination rowsPerPageOptions={[2,3,5]}
                count={orderedRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}/>
            </TableRow>            
        </TableFooter>}


        
        </>        
        
    )
}



// function EnhancedTableBody(props){
//     let {oRows,value,testSections,int_rounds,img_year,filteredRows,applyFilter,test_papers}=props;   
//     const [orderedRows,setOrderedRows]=React.useState()
//     useEffect(()=>{
//         setOrderedRows(oRows)
//     },[oRows])
    
//     const [page,setPage]=React.useState(0);
//     const[rowsPerPage,setRowsPerPage]=React.useState(5);

//     const handleChangePage=(event,newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value));
//         setPage(0);
//       };


//     //update marks and remarks
//     let [marks,setMarks]=React.useState('');
//     const [remarks,setRemarks]=React.useState('');
//     const [quesID,setQuesID]=React.useState()
//     const [candidateID,setCandidateID]=React.useState()
//     const [openModal,setOpenModal]=React.useState(false)
//     const handleOpenModal= (id,candidateSeason_id) => {setOpenModal(true);setQuesID(id);setCandidateID(candidateSeason_id)};
//     const handleCloseModal = () => {setOpenModal(false);setQuesID();setCandidateID();setMarks('');setRemarks('');};
//     const handleMarksChange=(event)=>{
//         setMarks(event.target.value)
//     }
//     const handleRemarksChange=(event)=>{
//         setRemarks(event.target.value)
//     }
//     const changeMarksRemarks=(marks,remarks)=>{
//         if(marks=="")
//         marks=null
//         const params=JSON.stringify({"marks":marks,"remarks":remarks,"ques_id":quesID,"candidate_season_id":candidateID});
//         axios
//         .post("http://localhost:8000/testresponse/update_marks/",params,{headers:{"Content-Type":"application/json"}},{withCredentials:true})        
//         .then(function(response){
//         handleCloseModal()
//         axios
//         .get("http://localhost:8000/candidate_season_data/get_marks/",{params:{paper_id:test_papers[value].id}},{withCredentials:true})
//         .then(function(response){
//             setOrderedRows(response.data)
//         })
//         })

    
//         // $.ajax({
//         //     type:'POST',
//         //     xhrFields: {
//         //         withCredentials: true
//         //      },
//         //     url:"http://localhost:8000/testresponse/update_marks/",
//         //     data: params,
//         //     headers:{"Content-Type":"application/json",'X-CSRFTOKEN':document.cookie.substring(10)},
//         //     success: function(response){
//         //         handleCloseModal()
//         //         // window.location.href=window.location.href
//         //         // reloadComp()
//         //         console.log("responded")
//         //         // return(
//         //         //     <EnhancedTableBody orderedRows={orderedRows} value={value} testSections={testSections} int_rounds={int_rounds} img_year={img_year} filteredRows={filteredRows} applyFilter={applyFilter} test_papers={test_papers} reloadComp={reloadComp}/>
//         //         // )
//         //         // setSt(!st)
//         //         axios
//         //     .get("http://localhost:8000/candidate_season_data/get_marks/",{params:{paper_id:test_papers[value].id}},{withCredentials:true})
//         //     .then(function(response){
//         //         setOrderedRows(response.data)
//         //     })
//         //     }
//         // })
        
//     }



    
    



//     //move to menu
//     const [selected,setSelected]=React.useState([])
//     const isSelected = (id) => selected.indexOf(id) !== -1;
//     const handleClick = (event, id) => {
//         const selectedIndex = selected.indexOf(id);
//         let newSelected = [];
    
//         if (selectedIndex === -1) {
//           newSelected = newSelected.concat(selected, id);
//         } else if (selectedIndex === 0) {
//           newSelected = newSelected.concat(selected.slice(1));
//         } else if (selectedIndex === selected.length - 1) {
//           newSelected = newSelected.concat(selected.slice(0, -1));
//         } else if (selectedIndex > 0) {
//           newSelected = newSelected.concat(
//             selected.slice(0, selectedIndex),
//             selected.slice(selectedIndex + 1),
//           );
//         }
//         setSelected(newSelected);
//       };

//     const [open,setOpen]=React.useState(false)
//     const [anchorEl,setAnchorEl]=React.useState(null)
//     const openMenu=(event)=>{
//         setOpen(!open)
//         setAnchorEl(event.currentTarget)
//     }
//     const handleCloseMenu=()=>{
//         setAnchorEl(null)
//         setOpen(false)
//     }
//     const moveToSelected=()=>{
        
//         for(let i=0;i<selected.length;i++)
//         {
//             const params=JSON.stringify({"id":selected[i]})
//             axios
//             .post("http://localhost:8000/candidate_season_data/move_to_selected/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
//             .then(function(response){
//                 window.location.href=window.location.href
//             })
//         }
        

//     }
//     const moveToInterview=(round_id)=>{
//         for(let i=0;i<selected.length;i++)
//         {
//             const params=JSON.stringify({"candidate_id":selected[i],"round_id":round_id})
//             axios
//             .post("http://localhost:8000/candidate_season_data/move_to_interview/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
//             .then(function(response){
//                 window.location.href=window.location.href
//             })
//         }
        
//     }







//     return(      
//         <>
//         <TableBody>
            
//         {orderedRows && (orderedRows.slice(page*rowsPerPage,(page+1)*rowsPerPage)).map((row,index)=>{
//             const isItemSelected = isSelected(row.id);
//             return(
//             <TableRow hover selected={isItemSelected}  onClick={(event) => handleClick(event, row.id)}>          
//             <TableCell padding="checkbox"><Checkbox checked={isItemSelected}/></TableCell>
//             <TableCell>{index+1}</TableCell>
//             <TableCell>{row.name}</TableCell>
//             <TableCell>{row.enrolment}</TableCell>
//             <TableCell>{row.eval_status}</TableCell>          
//             {img_year>2 && testSections.map((section)=>(
//                 <>
//                 {section.ques_list.map((ques)=>(
//                     <TableCell align="center" onClick={()=>{handleOpenModal(ques.id,row.id)}} sx={{cursor:'pointer'}}>
//                     {row.mark_list.map((mark,index)=>(
//                         <>
//                         {mark[0]==ques.id?<div title={mark[2]}>{mark[1]}</div>:null}                         
//                         </>
//                     ))}
//                     </TableCell>
//                 ))}
//                 <TableCell align="center" sx={{fontWeight:'bold'}}>
//                     {row.section_total_list.map((total)=>(
//                         section.id==total.section_id?<div>{total.total}</div>:null
//                     ))}
//                 </TableCell>
//                 </>
//             ))} 



//             <Modal open={openModal} onClose={handleCloseModal}>
//             <Box sx={{height:"20vh", width:"20vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3,borderRadius:2.5}}>
//                 <Typography sx={{mb:3,fontSize:20,fontWeight:'bold'}}>Q_ID{quesID}</Typography>
//                 <FormControl sx={{mb:3}}>
//                     <TextField label={"Enter New Marks"} type="number" required onChange={handleMarksChange} />
//                 </FormControl>
//                 <FormControl>
//                     <TextField label={"Enter New Remarks"} onChange={handleRemarksChange} />
//                 </FormControl>

//                 <Button variant="contained" sx={{position:"absolute", right:"2vw", bottom:'2vh'}} onClick={()=>{changeMarksRemarks(marks,remarks)}}>Submit</Button>
//             </Box>
//             </Modal>

            
//             </TableRow>            
//         )})}
//         </TableBody>
        

//         {orderedRows && <TableFooter  sx={{pt:3}}>   
//         <Button variant="contained" sx={{height:'4vh', width:'10vw',mt:2}} onClick={openMenu}>Move to  Round</Button>
//                 <Menu open={open} anchorEl={anchorEl} onClose={handleCloseMenu} >
//                     {int_rounds.map((round,index)=>(
//                     <MenuItem onClick={()=>{moveToInterview(round.id)}}>Interview Round {index+1}</MenuItem>
//                     ))}
//                     <MenuItem onClick={()=>{moveToSelected()}}>Selected</MenuItem>
//                 </Menu>     
//             <TableRow>
           
//                 <TablePagination rowsPerPageOptions={[2,3,5]}
//                 count={orderedRows.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}/>
//             </TableRow>            
//         </TableFooter>}


        
//         </>        
        
//     )
// }
























