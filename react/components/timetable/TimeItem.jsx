import React from 'react'

class TimeItem extends React.Component{
  constructor(props){
    super(props);
    this.state = {type : this.props.type, value: this.props.value};
    /** change checkbox values */
    this.changeCheckBox = this.changeCheckBox.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ type: nextProps.type, value: nextProps.value });
  }

  changeCheckBox(e){
    console.log(e.target.checked);
    let newType = this.state.type < 0 ? 0: this.state.type > 0 ? 0: -1;

    /** if here was an order */
    if(this.state.type === 1){

      /** save checkbox state to work (checked) */
      e.target.checked = true;

      if(!confirm(`Вы уверены, что хотите отменить запись для ${this.state.value.name} на ${this.props.dayDate}, ${this.state.value.hour}:00 ?`)){
        return;
      }
    }
    fetch('/admin/change-timetable',{
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body : JSON.stringify({dateID: this.props.dayID, hour: this.state.value.hour, value: newType, removeOrder: this.state.type === 1 ? this.state.value.val: false})
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if('error' in data){
        niceAlert(data.error);
        return;
      }
      if('message' in data){
        if(data.message === '%OK%'){
          if(this.state.type === 1){
            window.location.href = '/admin/timetable';
          }
          this.setState({type: newType});
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

    console.log(this.state.type !== -1);

    let content = '';
    let className = '';

    switch (this.state.type){
      case -1:
        content = 'не работаю';
        className = ' rest';
        break;
      case 0:
        content = 'работаю';
        className = ' work';
        break;
      case 1:
        content = this.state.value.name;
        className = ' user';
        break;
      default:
        break;
    }
    let ch='';
    if(this.state.type !== -1)
      ch='ch';

    return (
      <label className={`calendar_time_item ${className}`}>
        <input type="checkbox" defaultChecked={this.state.type !== -1} onChange={this.changeCheckBox}/>
        <span className={`box ${ch}`}></span>
        {this.props.value.hour}:00<br/>
        {content}
      </label>
    );
  }
}

module.exports = TimeItem;