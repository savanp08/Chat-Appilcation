import React from "react";
import './Home.css';

const Home = ()=>{
  const x = new Map();
  x.set(5,[4]); x.get(5).push(8)
  console.log("Debug MAp",x.get(5));
  console.log("In Home Page");
    return(
    <div className="Home-Wrapper">
      <div className="Home-Page">
          <div className="Login-Wrapper">
              <div className="Login-Container">
                Home
              </div>
          </div>

      </div>
    </div>
    );
}

export default Home;

