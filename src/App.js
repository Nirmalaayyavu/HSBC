import './App.css';
import { useEffect, useState } from 'react';

import axios from 'axios'

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import moment from 'moment';
import * as Constant from './constant'


function App() {

  
  const [timezoneList,setTimezoneList]= useState([])
  const [display,setDefaultTime] = useState({})
  const [title,setTitle] =useState (Constant.DROPDOWN_TITLE)


  const fetchData=()=>{
    const timezoneAPI = 'http://api.timezonedb.com/v2.1/list-time-zone?key=XWSLLPX5RMIZ&format=json&zone=Europe/*'
    const defaultTimezoneAPI = 'http://api.timezonedb.com/v2/get-time-zone?key=XWSLLPX5RMIZ&format=json&by=zone&zone=Europe/London'
    
    const getTimeZoneResponse = axios.get(timezoneAPI)
    const getDefaultTimeResponse = axios.get(defaultTimezoneAPI)

    axios.all([getTimeZoneResponse,getDefaultTimeResponse]).then(
      axios.spread((...response)=>{
        const timeZoneList = response[0].data.zones
        const defaultData = {
          name:response[1].data.zoneName,
          time:response[1].data.formatted
        }
        setTimezoneList(timeZoneList)
        setDefaultTime(defaultData)

      })
    ).catch((errors)=>{
      console.log("error occured ")
    })
  }
  

  const getUpdateTime =(zoneName)=>{
    axios.get(`http://api.timezonedb.com/v2/get-time-zone?key=XWSLLPX5RMIZ&format=json&by=zone&zone=${zoneName}`)
    .then(response=>{
      setDefaultTime({
        name:response.data.zoneName,
        time:response.data.formatted
      })
    })
    .catch((error)=>{
      console.log("error occured")
    })
  }
  const handleChange =(value)=>{
    setTitle(value)
    getUpdateTime(value)
  }
 
  useEffect(()=>{
    fetchData()
    
  },[])

  useEffect(()=>{
    setInterval(() => {
      if(title !==Constant.DROPDOWN_TITLE)
      handleChange(title)
    }, 5000);
  },[title])

  return (
    <div className="App">
      <h1>React Timezone Example</h1>
      <br/>
      <h2> Time in  {display.name? display.name.replace('/',' - '):''} : {moment(display.time).format("hh:mm A")}</h2>
      <br/>
      <DropdownButton id="country-list" title={title}>
        {timezoneList.length>0 && timezoneList.map((items,i)=>(
        <Dropdown.Item value={items.zoneName} key={i} 
        onSelect={()=>handleChange(items.zoneName)}>
          {items.zoneName.replace('/',' - ')}</Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
}

export default App;
