import React from 'react';

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {buttonState: {id: 0, name: 'Далее'}};

    this.clickButton = this.clickButton.bind(this);

    /** get suitable times for order */
    this.getTimes = this.getTimes.bind(this);

    /** make order */
    this.addOrder = this.addOrder.bind(this);
  }

  clickButton() {

    /** button role = next button */
    if(this.state.buttonState.id === 0)
    {
      if(this.props.total.price === 0){
        niceAlert('Select please');
        return;
      }
      this.getTimes();

    }

    /** button role = ready button */
    else {
      if(this.props.date.time)
        this.addOrder();
    }
  }

  getTimes(){
    fetch('order/time',{
      method: 'POST',
      /** for save session */
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body : JSON.stringify({duration: this.props.total.duration})
    })
    .then(res => res.json())
    .then(data => {
      if('error' in data){
        niceAlert(data.error);
        return;
      }
      // console.log(data);
      console.log('click');
      this.setState({
        buttonState: {id: 1, name: "Готово"}
      }, () => this.props.showCalendar(data));
    })
    .catch(err => {
      console.log(err);
    });
  }

  addOrder (){
    console.log(this.props.total);
    console.log(this.props.date);

    fetch('order/new',{
      method: 'POST',
      /** for save session */
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body : JSON.stringify(
        {
          date: this.props.date.id,
          time: this.props.date.time,
          duration: this.props.total.duration,
          price: this.props.total.price,
          services: this.props.total.selectedServices
        })
    })
    .then(res =>
      res.json()
    )
    .then(data => {
      console.log(data);
      if('error' in data){
        niceAlert(data.error);
        return;
      }
      if('message' in data){
        if(data.message === '%OK%'){
          window.location.assign('profile');
        }
        return;
      }
      console.log(data);

    })
    .catch(err => {
      console.log(err);
    });

  }
  render(){
    return (
      <div className="order_button"  onClick = {this.clickButton}>
        <div className="button_content">{this.state.buttonState.name}</div>
        <div className="button_arrow"></div>
      </div>
    );
  }

}

module.exports = Button;