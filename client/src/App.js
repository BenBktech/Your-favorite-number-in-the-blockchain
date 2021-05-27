import React, { Component } from "react";
import FavoriteNumber from "./contracts/FavoriteNumber.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  state = { loaded: false, favoriteNumber: 0, number: -1, error: "", success: "" }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.FavoriteNumber = new this.web3.eth.Contract(
        FavoriteNumber.abi,
        FavoriteNumber.networks[this.networkId] && FavoriteNumber.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state
      // Get the favorite number or listen to a new favorite number
      this.getFavoriteNumber();
      this.listenToFavoriteNumberUpdates();
      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  //When the user changes the "Favorite Number" input field
  handleInputChange = (event) => {
    this.setState({favoriteNumber: event.target.value})
  }

  //When the user click on the submit button
  handleSubmit = async () => {
    const { favoriteNumber } = this.state;
    if(favoriteNumber < 1 || favoriteNumber > 65535) {
      this.setState({error: "Your favorite number has to be between 1 and 65535.", success: ""});
    }
    else {
      let result = await this.FavoriteNumber.methods.setFavoriteNumber(favoriteNumber).send({from:this.accounts[0]});
      this.getFavoriteNumber();
      if(result) {
        this.setState({error: "", success: "Your favorite number has been added to the blockchain."});
      }
    }
  }

  //If the user has already a favorite number (he did already use the App to put his favorite number)
  getFavoriteNumber = async () => {
    let result = await this.FavoriteNumber.methods.getFavoriteNumber(this.accounts[0]).call();
    result >= 0 && this.setState({number:result});
  }

  //When an user updates his favorite number, get the new number in the blockchain and put it in the sate
  listenToFavoriteNumberUpdates = () => {
    this.FavoriteNumber.events.FavoriteNumberSet().on('data', async function(evt) {
      let result = await evt.returnValues._number;
      this.setState({number:result});
    }.bind(this));
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Put your favorite number in the blockchain</h1>
        <p className="description">Writing your favorite number in the blockchain allows to register it in an immutable way in a database. Nobody else than you will be able to modify this number. And if you change your favorite number, the trace of the old number will remain forever.</p>
        {this.state.error !== "" && <p className="error">{this.state.error}</p>}
        {this.state.success !== "" && <p className="success">{this.state.success}</p>}
        <input type="number" value={this.state.favoriteNumber} onChange={this.handleInputChange} />
        <button type="button" onClick={this.handleSubmit}>set your favorite number</button>
        <div className="favoriteNumber">Your Favorite Number is : {this.state.number == 0 ? <strong>not defined yet</strong> : <strong>{this.state.number}</strong>}</div>
      </div>
    );
  }
}

export default App;
