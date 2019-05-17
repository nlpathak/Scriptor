import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import './User.css';

function User() {
  const loggedin = true;
  if(loggedin) {
    return (
      <div className='tabwrap'> 
        <Tabs>
          <div className='col-xs-1 text-center'> 
            <TabList>
              <Tab>History</Tab>
              <Tab>Favorites</Tab>
              <Tab>Settings</Tab>
            </TabList>
          </div>

          <TabPanel>
              History not implemented.
          </TabPanel>
          <TabPanel>
            Favorites not implemented.
          </TabPanel>
          <TabPanel>
            Change password not implemented.
          </TabPanel>
          </Tabs>
      </div>
    );
  } else {
    window.location.assign('/');
  }
}

export default User;