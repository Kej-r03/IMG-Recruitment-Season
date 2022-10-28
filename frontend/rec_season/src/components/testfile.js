import React from "react";


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 36, 16.0, 49, 3.9),
  ]

//when isAsc is false, ord must be 'asc'
//when isAsc is true, ord must be'desc'
export default function TestFile()
{
    let isAsc=true
    let property='fat'
    let ord=isAsc?'desc':'asc'
    let orderedRows=rows.sort((a,b)=>{
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

    console.log(ord)
    console.log(orderedRows)
}