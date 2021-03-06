import './App.css';
import { useEffect, useState } from 'react';

import axios from 'axios'

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import moment from 'moment';
import * as Constant from './constant'


function App() {


  const [timezoneList, setTimezoneList] = useState([])
  const [display, setDefaultTime] = useState({})
  const [title, setTitle] = useState(Constant.DROPDOWN_TITLE)


  /*
    A method which gets triggered after the page load .
    It gets the default time in London location and list of countries with their respective time in that zone.
    */ 
  const fetchData = () => {
    const timezoneAPI = 'http://api.timezonedb.com/v2.1/list-time-zone?key=XWSLLPX5RMIZ&format=json&zone=Europe/*'
    const defaultTimezoneAPI = 'http://api.timezonedb.com/v2/get-time-zone?key=XWSLLPX5RMIZ&format=json&by=zone&zone=Europe/London'

    const getTimeZoneResponse = axios.get(timezoneAPI)
    const getDefaultTimeResponse = axios.get(defaultTimezoneAPI)

    axios.all([getTimeZoneResponse, getDefaultTimeResponse]).then(
      axios.spread((...response) => {
        const timeZoneList = response[0].data.zones
        const defaultData = {
          name: response[1].data.zoneName,
          time: response[1].data.formatted
        }
        setTimezoneList(timeZoneList)
        setDefaultTime(defaultData)

      })
    ).catch((errors) => {
      console.log("error occured ")
    })
  }

  /* A method to get the updated time in the selected country with zone name 
   * @param {string} zoneName returns the value of the selected country with  selected zone name   
  */

  const getUpdateTime = (zoneName) => {
    axios.get(`http://api.timezonedb.com/v2/get-time-zone?key=XWSLLPX5RMIZ&format=json&by=zone&zone=${zoneName}`)
      .then(response => {
        setDefaultTime({
          name: response.data.zoneName,
          time: response.data.formatted
        })
      })
      .catch((error) => {
        console.log("error occured")
      })
  }

  /*  The event callback method when the dropdown value is changed/selected
   *   @param {string} value of format 'Europe\/London'
   */
  const handleChange = (value) => {
    setTitle(value)
    getUpdateTime(value)
  }


  /* The callback method which will get the updatedTime  for every 5 seconds */
  const refresh = () => {
    setTitle(display.name)
    getUpdateTime(display.name)
  }

  useEffect(() => {
    fetchData()
  }, [])

  /*  The method to trigger the fecth call for every 5 seconds */
  useEffect(() => {
    const interval = setInterval(() => {
      refresh()
    }, 5000);
    return () => clearInterval(interval);
  }, [display.name]);

  return (
    <div className="App">
      {timezoneList.length === 0 ? (
        <div data-testid="loader">Loading...</div>
      ) : (
        <div data-testid="timerSection">
          <h1>React Timezone Example</h1>
          <br />
          <h2 data-testid="time-display"> Time in  {display.name ? display.name.replace('/', ' - ') : ''} : {moment(display.time).format("hh:mm:ss A")} </h2>
          <br />
          <DropdownButton id="country-list" title={title}>
            {timezoneList.map((items, i) => (
              <Dropdown.Item key={i} eventKey={items.zoneName}
                onSelect={(e) => handleChange(e)} data-testid="list">
                {items.zoneName.replace('/', ' - ')}</Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
      )}
    </div>
  )

}

export default App;
