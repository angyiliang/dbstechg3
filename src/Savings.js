import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Savings extends Component {
  constructor(props) {
    super(props);
  }

  getAllClients() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    return fetch('https://techtrek-api-gateway.cfapps.io/customers/:userName', {
      method: 'GET',
      headers: {
        'identity': "G3",
        'token': "9f0ffe48-1e61-47d5-804f-205e769c7fde"
      },
      params: {
        "customerId": "2"
      }
    })
      .then(result => result.json())
      // .then(items => console.log(items)
      .then(items => this.setState({ items }))
      .catch((error) => {
        console.error(error);
      });
  }



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default Savings;
