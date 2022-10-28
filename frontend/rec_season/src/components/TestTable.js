import React,{useEffect} from "react"
import { ThemeProvider,IconButton,Menu,MenuItem,Modal, TextField,Button,Typography,Link,Breadcrumbs,createTheme,AppBar, Paper,Table, TablePagination,TableFooter, Toolbar,Box,Tabs,Tab,Divider, TableContainer, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Checkbox, FormLabel, Radio,RadioGroup, FormControlLabel ,FormControl} from "@mui/material";
import axios from "axios";
import FilterListIcon from '@mui/icons-material/FilterList';



const headCells=[{id:"slno",value:"Sl No"},{id:"name",value:"Name"},{id: "enrolment",value:"Enrolment No"},{id:"eval_status",value:'Evaluation Status'}]
//NOTE: id must be same as objects' keys

export default function TestTable(props){

    const {value,test_papers,int_rounds}=props    

   


    const [testSections,setTestSections]=React.useState([])
    const [rows,setRows]=React.useState([])
    useEffect(()=>{
            axios
            .get("http://localhost:8000/testsection/get_sections/",{params:{paper_id:test_papers[value].id}},{withCredentials:true})
            .then(function(response){
                setTestSections(response.data)
            })
            axios
            .get("http://localhost:8000/candidate_season_data/get_marks/",{params:{paper_id:test_papers[value].id}},{withCredentials:true})
            .then(function(response){
                setRows(response.data)
                setFilteredRows(response.data)
            })
            reset()
        
    },[value])   

    





    //filter
    const [open, setOpen] = React.useState(false);
    const openFilter = () => setOpen(true);
    const closeFilter = () => setOpen(false);

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

    const [filteredRows,setFilteredRows]=React.useState([])//stores the rows after all filters

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
    }

    const reset=()=>{
        setFilteredRows(rows)
        setRadioValue('All')
        setSectionValue([])
        closeFilter()
    }
    const getDefaultSectionValue=(id)=>{ //used for setting default value in section filters
        let index=-1
        for(let i=0;i<sectionValue.length;i++)
        {
            if(sectionValue[i].id==id)
            return sectionValue[i].value
        }
    }







    //ordering in table
    const [order,setOrder]=React.useState('asc');//variable to store whether to sort by ascending order or descending order
    const [orderBy,setOrderBy]=React.useState("Sl No");//variable to store column as per which table is sorted
    let orderedRows=filteredRows;

    function createSortHandler(property){
        const isAsc= orderBy === property && order==='asc';
        setOrder(isAsc?'desc':'asc');
        setOrderBy(property);

        let ord=isAsc?'desc':'asc'
        orderedRows=filteredRows.sort((a,b)=>{
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

    

    return(<>
            <Button variant="contained" sx={{position:"absolute", right:'5vw',top:'28vh',width:'10vw'}} startIcon={<FilterListIcon />} onClick={openFilter}>Filter</Button>
            <Modal open={open} onClose={closeFilter}>
            <Box sx={{height:"25vh", width:"20vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"30%",right:"5.5vw", p:3}}>

                <Typography sx={{fontWeight:'bold'}}>Filters</Typography>

                <div>
                <FormControl>
                    <FormLabel>Evaluation Status</FormLabel>
                    <RadioGroup row value={radioValue} onChange={handleRadioChange}>
                        <FormControlLabel value="All" control={<Radio />} label="All"/>
                        <FormControlLabel value="Evaluated" control={<Radio />} label="Evaluated"/>
                        <FormControlLabel value="Not Evaluated" control={<Radio />} label="Not Evaluated"/>
                    </RadioGroup>
                </FormControl>
                </div>

                <FormLabel>Sections</FormLabel><br />
                {testSections.map((section)=>(
                    <div>
                    <FormControl>
                        <div style={{display:'inline-block'}}>
                        Greater than <input type="number"  style={{width:'2vw'}} onChange={(event)=>{changeSectionFilter(event,section.id)}} defaultValue={getDefaultSectionValue(section.id)} /> for {section.section_name}
                        </div>
                </FormControl>
                </div>
                ))}

                <Button variant="contained" onClick={applyFilter}>Apply</Button>
                <Button variant="contained" onClick={reset}>Reset</Button>
                
            </Box>
            </Modal>







        <TableContainer>
        <Table>

        <TableHead>
            <TableRow>

                <TableCell padding="checkbox" rowspan={2}></TableCell>

                {headCells.map((header)=>(
                    <TableCell rowSpan={2}>
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

                {testSections.map((section)=>(
                    <TableCell colSpan={section.ques_list.length} align="center">
                    <Typography sx={{fontWeight:'bold', fontSize:20}}>
                       {section.section_name}
                       </Typography>
                </TableCell>
                ))}
            </TableRow>


            <TableRow>
                {testSections.map((section)=>(
                    <>
                    {section.ques_list.map((question)=>(
                    <TableCell>
                        <Typography sx={{fontWeight:'bold', fontSize:20}} align="center">
                        <span title={question.q_text}>Q_ID{question.q_id}</span>
                        </Typography>
                    </TableCell>
                    ))}
                    </>
                ))}

            </TableRow>            
        </TableHead>






        <EnhancedTableBody orderedRows={orderedRows} value={value} testSections={testSections} int_rounds={int_rounds}/>
        </Table>
        </TableContainer>
        </>
    )
}





function EnhancedTableBody(props){
    const {orderedRows,value,testSections,int_rounds}=props;        
    
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
    const handleOpenModal= (q_id,candidateSeason_id) => {setOpenModal(true);setQuesID(q_id);setCandidateID(candidateSeason_id)};
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
            
        {(orderedRows.slice(page*rowsPerPage,(page+1)*rowsPerPage)).map((row,index)=>{
            const isItemSelected = isSelected(row.id);
            return(
            <TableRow hover selected={isItemSelected}  onClick={(event) => handleClick(event, row.id)}>          
            <TableCell padding="checkbox"><Checkbox checked={isItemSelected}/></TableCell>
            <TableCell>{index+1}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.enrolment}</TableCell>
            <TableCell>{row.eval_status}</TableCell>          
            {testSections.map((section)=>(
                <>
                {section.ques_list.map((ques)=>(
                    <TableCell align="center" onClick={()=>{handleOpenModal(ques.q_id,row.id)}} sx={{cursor:'pointer'}}>
                    {row.mark_list.map((mark,index)=>(
                        <>
                        {mark[0]==ques.q_id?<div title={mark[2]}>{mark[1]}</div>:null}                         
                        </>
                    ))}
                    </TableCell>
                ))}
                </>
            ))} 



            <Modal open={openModal} onClose={handleCloseModal}>
            <Box sx={{height:"20vh", width:"20vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>
                <Typography sx={{mb:3,fontSize:20,fontWeight:'bold'}}>Update Marks and Remarks</Typography>
                <FormControl sx={{mb:3}}>
                    <label for="marks">Enter New Marks*</label>
                    <input type="number" onChange={handleMarksChange} id="marks" placeholder="Mandatory Field" />
                </FormControl>
                <FormControl>
                    <label for="remarks">Enter New Remarks</label>
                    <input type="text" onChange={handleRemarksChange} id="remarks"/>
                </FormControl>

                <Button variant="contained" sx={{position:"absolute", right:"2vw", bottom:'2vh'}} onClick={()=>{changeMarksRemarks(marks,remarks)}}>Submit</Button>
            </Box>
            </Modal>

            
            </TableRow>            
        )})}
        </TableBody>
        

        <TableFooter  sx={{pt:3}}>   
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
        </TableFooter>


        
        </>        
        
    )
}

