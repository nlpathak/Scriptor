import React from 'react';
import './About.css';

function About() {
  return (
    <div className='about'>
	  <h1>ABOUT US</h1>
	  <div className='statement'>
	  	<h3><u>Blah</u></h3>
	  	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sit amet vestibulum quam, a ultricies lacus. Suspendisse augue felis, tempor ac dolor et, convallis pulvinar nunc. Fusce maximus nibh id nulla venenatis consectetur. Aliquam mattis massa at erat faucibus eleifend. Maecenas sed justo et ipsum bibendum accumsan. Cras non pellentesque turpis. Ut vulputate urna magna, sit amet ornare mauris aliquet ac. Morbi dictum lacus eu metus suscipit, sed porttitor libero sollicitudin. Curabitur suscipit nunc luctus est iaculis, a semper mi pharetra. Suspendisse vitae sodales risus. Nulla cursus augue augue, nec fringilla enim cursus ut. Duis volutpat euismod diam sit amet blandit. Vestibulum volutpat nisl eu nibh condimentum congue. Quisque porttitor at urna aliquet iaculis. Curabitur porta, nibh vel maximus consequat, massa purus porta lorem, id vehicula purus mi vitae augue. Nulla sed urna cursus, porttitor nunc eu, efficitur lacus.</p>
	  </div>
	  <div className='groupPhoto'>	
	  	<img src="https://user-images.githubusercontent.com/36279762/58217930-ce183e00-7cb9-11e9-9e68-84d5b82622ff.jpg"
	  		alt="Error"
	  		style={{width: '100%'}}/>
	  	<p className='description'>The people that made this possible!</p>
	  </div>
	  
	  <div className='team'>
	  <h2><u>MEET THE TEAM</u></h2>
	  </div>
		
	  <div className='teamList'>
	  	<div className='person'>
	  	<p className='personDesc'>David Febles</p>
	  	<img src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		style={{width: '100%'}}/>
	  	<p className='personDesc'>Project Manager</p>
	  	</div>

		<div className='person'>
	  	<p className='personDesc'>Amithab Arumugam</p>
	  	<img src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		style={{width: '100%'}}/>
	  	<p className='personDesc'>Software Development Lead</p>
	  	</div>

		<div className='person'>
	  	<p className='personDesc'>Kelvin Chan</p>
	  	<img src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"
	  		style={{width: '100%'}}/>
	  	<p className='personDesc'>Senior System Analyst</p>
	  	</div>

		<div className='person2'>
	  	<p className='personDesc'>Somsubhro Dhar</p>
	  	<img src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		style={{width: '100%'}}/>
	  	<p className='personDesc'>Business Analyst</p>
	  	</div>

		<div className='person2'>
	  	<p className='personDesc'>Raghavan Kope</p>
	  	<img src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		style={{width: '100%'}}/>
	  	<p className='personDesc'>Database Specialist</p>
	  	</div>
	  	
	  	<div className='person2'>
	  	<p className='personDesc'>Sabeel Mansuri</p>
	  	<img src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		style={{width: '100%'}}/>
	  	<p className='personDesc'>UI Specialist</p>
	  	</div>

	  	<div className='person2'> 
	  	<p className='personDesc'>Pranav Narasimmaraj</p>
	  	<img src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		style={{width: '100%'}}/>
	  	<p className='personDesc'>Algorithm Specialist</p>
	  	</div>

	  	<div className='person3'>
	  	<p className='personDesc'>Nikhil Pathak</p>
	  	<img src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		style={{width: '100%'}}/>
	  	<p className='personDesc'>Software Development Lead</p>
	  	</div>
	  	
	  	<div className='person3'>
	  	<p className='personDesc'>Subhash Ramesh</p>
	  	<img src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		style={{width: '100%'}}/>
	  	<p className='personDesc'>Software Architect</p>
	  	</div>

	  	<div className='person3'>
	  	<p className='personDesc'>Ayush Shukla</p>
	  	<img src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		style={{width: '100%'}}/>
	  	<p className='personDesc'>Quality Assurance Lead</p>
	  	</div>

	  	<div className='person3'>
	  	<p>Shuusei Yoshida</p>
	  	<img src="https://user-images.githubusercontent.com/36279762/58230298-cf149400-7ce8-11e9-8874-99f97d7e6e5d.png"	
	  		style={{width: '100%'}}/>
	  	<p>UI Specialist</p>
	  	</div>
	  </div>
    </div>
  );
}

export default About;
