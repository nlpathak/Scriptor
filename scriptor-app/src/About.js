import React from 'react';
import './About.css';

function About() {
  return (
    <div className='about'>
	  
	  <h1>ABOUT US</h1>
	  
	  <div className='statement'>
	  	<h3><u>Who are we?</u></h3>
	  	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sit amet vestibulum quam, a ultricies lacus. 
	  	Suspendisse augue felis, tempor ac dolor et, convallis pulvinar nunc. Fusce maximus nibh id nulla venenatis 
	  	consectetur. Aliquam mattis massa at erat faucibus eleifend. Maecenas sed justo et ipsum bibendum accumsan. Cras 
	  	non pellentesque turpis. Ut vulputate urna magna, sit amet ornare mauris aliquet ac. Morbi dictum lacus eu metus 
	  	suscipit, sed porttitor libero sollicitudin.</p>
	  	<h3><u>About Scriptor</u></h3>
	  	<p>Curabitur suscipit nunc luctus est iaculis, a semper mi pharetra. 
	  	Suspendisse vitae sodales risus. Nulla cursus augue augue, nec fringilla enim cursus ut. Duis volutpat euismod 
	  	diam sit amet blandit. Vestibulum volutpat nisl eu nibh condimentum congue. Quisque porttitor at urna aliquet 
	  	iaculis. Curabitur porta, nibh vel maximus consequat, massa purus porta lorem, id vehicula purus mi vitae augue. 
	  	Nulla sed urna cursus, porttitor nunc eu, efficitur lacus.</p>
	  </div>

	  <div className='groupPhoto'>	
	  	<img src="https://user-images.githubusercontent.com/36279762/58217930-ce183e00-7cb9-11e9-9e68-84d5b82622ff.jpg"
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='description'>The people that made this possible!</p>
	  </div>

	  <div className='team'> 
	  <h1>MEET THE TEAM</h1>
	  </div>

	  <div className='teamList'>
	  	<div className='teamRow1'>
	  	<img className='profile' src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>David Febles</p>
	  	<p className='description'>Project Manager</p>
	  	</div>

		<div className='teamRow1'>
	  	<img className='profile' src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Amithab Arumugam</p>
	  	<p className='description'>Software Development Lead</p>
	  	</div>

		<div className='teamRow1'>
	  	<img className='profile' src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Kelvin Chan</p>
	  	<p className='description'>Senior System Analyst</p>
	  	</div>

		<div className='teamRow2'>
	  	<img className='profile' src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Somsubhro Dhar</p>
	  	<p className='description'>Business Analyst</p>
	  	</div>

		<div className='teamRow2'>
	  	<img className='profile' src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Raghavan Kope</p>
	  	<p className='description'>Database Specialist</p>
	  	</div>
	  	
	  	<div className='teamRow2'>
	  	<img className='profile' src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Sabeel Mansuri</p>
	  	<p className='description'>UI Specialist</p>
	  	</div>

	  	<div className='teamRow2'> 
	  	<img className='profile' src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Pranav Narasimmaraj</p>
	  	<p className='description'>Algorithm Specialist</p>
	  	</div>

	  	<div className='teamRow3'>
	  	<img className='profile' src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Nikhil Pathak</p>
	  	<p className='description'>Software Development Lead</p>
	  	</div>
	  	
	  	<div className='teamRow3'>
	  	<img className='profile' src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Subhash Ramesh</p>
	  	<p className='description'>Software Architect</p>
	  	</div>

	  	<div className='teamRow3'>
	  	<img className='profile' src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Ayush Shukla</p>
	  	<p className='description'>Quality Assurance Lead</p>
	  	</div>

	  	<div className='teamRow3'>
	  	<img className='profile' src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='name'>Shuusei Yoshida</p>
	  	<p className='description'>UI Specialist</p>
	  	</div>
	  </div>
    </div>
  );
}

export default About;
