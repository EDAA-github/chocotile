import React from 'react'
import Calendar from './Calendar';


class Order extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      timetable: [],
      selectedDate: { id : false}
    };

    /** change date */
    this.ChangeDate = this.ChangeDate.bind(this);
  }

  componentWillMount() {
    /** get timetable */
    fetch('/admin/timetable',{
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }})
    .then(res => res.json())
    .then(data => {
      this.setState({timetable: data, selectedDate: {id: data[0].id}});
    })
    .catch(err => {
      console.log(err);
    })
  }





  ChangeDate(newDateID){

    this.setState({selectedDate: {id: newDateID}}, function () {

    });
  }

  render(){
    let content = '';
    if(this.state.timetable.length > 0){
      content = <Calendar
        timetable = {this.state.timetable}
        changeDate = {this.ChangeDate}
        selectedDayID = {this.state.selectedDate.id}
      />;
    }
    return(
      <form className="order_component" id="orderForm">
        {content}
      </form>
    );
  }
}

module.exports = Order;