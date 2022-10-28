import axios from "axios";
import React from "react";

axios.defaults.withCredentials = true;
export default function Rd(){
    const thisUrl=window.location.href;
    const code=thisUrl.slice(thisUrl.indexOf('=')+1,thisUrl.indexOf('&'))
    const params={"code":code};
    axios
    .post('http://localhost:8000/login/login2/',params,{withCredentials:true})
    .then(function(res){
        let url="http://localhost:3000/onlogin/"
        window.location.href=url
    })
    
}