import logo from './twitter.svg';
import './App.css';
import {FaCrosshairs} from 'react-icons/fa'
import {useState,useEffect} from 'react'
import axios from 'axios' 


function App() {
  const[trends,setTrends] = useState([])
  
  const[woeid, setWoeid] = useState('1')

  useEffect(() => getTrends(), [woeid])

  function getTrends (){
    axios
      .get('https://teste-backend-api-twitter.herokuapp.com/api/trends',{
       params:{
        woeid,
       } 
      })
      .then( response =>{
        //console.log(response.data) 
        setTrends(response.data[0].trends)
      }) 
    .catch(error => console.log(error.message))
  }
    
  function localizacao(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        position => {
          axios
            .get('https://teste-backend-api-twitter.herokuapp.com/api/near-me',{
              params:{
                lat: position.coords.latitude,
                long:position.coords.longitude,
              }
            })
            .then(response => {
              console.log(response.data[0].woeid)
              setWoeid(response.data[0].woeid)
            })
            .catch(error => console.log(error.message))
        },
        error => {
          console.log(Error.message)
        }
      )
    } else {
      alert('Geolocalização Não Suportada')
    }
  }

  function listTrends(){
    return(
      <ul>
        {trends.map((trend,index)=> {
          return(
            <li key = {index}>
              <a href={trend.url}>{trend.name}</a>
              {trend.tweet_volume && (
                <span className="tweet_volume">{trend.tweet_volume}</span>
              )}
            </li>
          )
        })}
      </ul>
    )
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="logo" alt="twitter" />
        <h3> Twitter Trends</h3>
      </header>
      <div className='menu'>
        <select name = 'trending-place' onChange={e => setWoeid(e.target.value)}>
          <option value='1'>Mundo</option>
          <option value='23424768'>Brasil</option>  
          <option value='23424900'>México</option>  
          <option value='23424829'>Alemanha</option>  
        </select>
        <div className='location' onClick={localizacao}>
          <FaCrosshairs/>
        </div>
      </div>
      <div className='content'>{listTrends()}</div>
    </div>
  );
}

export default App;
