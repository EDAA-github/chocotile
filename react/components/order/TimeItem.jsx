import React from 'react'

class TimeItem extends React.Component{
  constructor(props){
    super(props);
    this.SelectTime = this.SelectTime.bind(this);

  }

  SelectTime(e){
    let el = document.querySelector('div.calendar_time_item.selected');
    if (el)
    el.classList.remove('selected');
    e.target.className += ' selected';
    this.props.click(this.props.value);
  }

  render(){
    return (
      <div className="calendar_time_item" onClick={this.SelectTime}>
        {this.props.value}:00
      </div>
    );
  }
}

module.exports = TimeItem;