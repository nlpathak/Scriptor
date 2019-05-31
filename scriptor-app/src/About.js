import React from 'react';
import './About.css';
import Sabeel from './assets/Sabeel.png';
import Raghavan from './assets/Raghavan.png';
import Kelvin from './assets/Kelvin.png';
import Subhash from './assets/Subhash.png';
import Amithab from './assets/Amithab.png';
import Nikhil from './assets/Nikhil.png';
import Pranav from './assets/Pranav.png';
import Ayush from './assets/Ayush.png';
import David from './assets/David.png';
import Shuu from './assets/Shuu.png';
import Som from './assets/Som.png';
import Logo from './assets/ScriptorLogo.jpg';


function About() {
  return (
    <div className='about'>
	  
	  <h1>ABOUT US</h1>
	  
	  <div className='statement'>
	  	<h3><u>Who are we?</u></h3>
	  	<p style={{color: 'rgba(72,136,163,.93)'}}>Scriptor is developed and maintained by eleven undergraduates at the University of California, San 
			  Diego. Each of us is on a pursuit of revolution - revolution against all that is improper, all that is impractical,
			  and all that is impossible. Our collective goals are simple: to better our world, to provide for our
			  community, and to strive to be the best individuals we can be. And so, with this pursuit in our hearts and with 
			  these goals in our minds, we bring forth Scriptor.
		  </p>
	  	<h3><u>About Scriptor</u></h3>
	  	<p style={{color: 'rgba(72,136,163,.93)'}}>Scriptor is our solution for streamlining studying and reviewing at the University of California,
		  San Diego. No longer do students have to manually search for specific information in the vast collection of knowledge that is the UC San Diego Podcast System; 
		  rather, with Scriptor, they can simply search for the information they desire and be presented with the exact material they want. Scriptor connects users 
		  with precise timestamps in podcasts that match the information they seek, efficiently parsing through the vast database of podcasts so students don't have to. 
		  So, leave the searching to us and focus on learning. Happy podcasting!</p>
	  </div>

	  <div className='groupPhoto'>	
	  	<img src={Logo}
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  </div>

	  <div className='team'> 
	  <h1>MEET THE TEAM</h1>
	  </div>

	  <div className='teamList'>
	  	<div className='teamRow1'>
	  	<img className='profile' src={Subhash}
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Subhash Ramesh</p>
	  	<p className='description'>Software Architect</p>
	  	</div>

		<div className='teamRow1'>
	  	<img className='profile' src={Sabeel}
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Sabeel Mansuri</p>
	  	<p className='description'>User Interface Specialist</p>
	  	</div>

		<div className='teamRow1'>
	  	<img className='profile' src={Nikhil}
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Nikhil Pathak</p>
	  	<p className='description'>Software Development Lead</p>
	  	</div>

		<div className='teamRow2'>
	  	<img className='profile' src={Ayush}
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Ayush Shukla</p>
	  	<p className='description'>Quality Assurance Lead</p>
	  	</div>

		<div className='teamRow2'>
	  	<img className='profile' src={Kelvin}
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Kelvin Chan</p>
	  	<p className='description'>Senior System Analyst</p>
	  	</div>
	  	
	  	<div className='teamRow2'>
	  	<img className='profile' src={Pranav}	
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Pranav Narasimmaraj</p>
	  	<p className='description'>Algorithm Specialist</p>
	  	</div>

	  	<div className='teamRow2'> 
	  	<img className='profile' src={Amithab}
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Amithab Arumugam</p>
	  	<p className='description'>Software Development Lead</p>
	  	</div>

	  	<div className='teamRow3'>
	  	<img className='profile' src={Raghavan}
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Raghavan Kope</p>
	  	<p className='description'>Database Specialist</p>
	  	</div>
	  	
	  	<div className='teamRow3'>
	  	<img className='profile' src={Som}
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Som Dhar</p>
	  	<p className='description'>Business Analyst</p>
	  	</div>

	  	<div className='teamRow3'>
	  	<img className='profile' src={Shuu}
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Shuu Yoshida</p>
	  	<p className='description'>User Interface Specialist</p>
	  	</div>

	  	<div className='teamRow3'>
	  	<img className='profile' src={David}
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>David Febles</p>
	  	<p className='description'>Project Manager</p>
	  	</div>
	  </div>
    </div>
  );
}

export default About;
