import React from 'react'
import Service from './Service'
import Total from './Total';
import Button from './OrderButton';
import Calendar from './Calendar';


class Order extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      services : [],
      total: { price: 0, duration:0, selectedServices: [] } ,
      content : 'services',
      timetable: [],
      selectedDate: { id : false}
    };

    /** Choose this type of service */
    this.SelectService = this.SelectService.bind(this);

    /** select/unselect some service items */
    this.ChangeServiceItem = this.ChangeServiceItem.bind(this);

    /** show calendar block */
    this.ShowCalendar = this.ShowCalendar.bind(this);

    /** change free date */
    this.ChangeDate = this.ChangeDate.bind(this);
  }

  componentDidMount() {
    /** get services */
    fetch('order/services',{
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }})
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({services: data});
      })
      .catch(err => {
        console.log(err);
      })
  }


  SelectService(object){
    let price = this.state.total.price;
    let duration = this.state.total.duration;
    let selectedServices = this.state.total.selectedServices;
    if (object.isSelected){
      this.state.services.forEach(item=>{
        if(item.default === 1){
          let newItem = {};
          Object.assign(newItem, item);
          newItem.is_manicure = object.type;
          price += newItem.price;
          duration += newItem.duration;
          selectedServices.push(newItem);
        }
      });
    }
    else {
      selectedServices = selectedServices.filter( e => {
        let retVal = e.is_manicure !== object.type;
        if(!retVal) {
          price -= e.price;
          duration -= e.duration;
        }
        return retVal;
      });
    }
    if (selectedServices.length > 0)
      duration = duration < 1 ? 1 : duration;
    this.setState({total: {selectedServices: selectedServices, price: price, duration: duration}},
      function(){
      console.log(this.state.total);
    });
  }

  ChangeServiceItem(object){
    console.log(object);
    let price = this.state.total.price;
    let duration = this.state.total.duration;
    let selectedServices = this.state.total.selectedServices;

    /** state changed item */
    let serviceItem = {};


    if(object.isChosen){
      /** copy item for new service item */
      Object.assign(serviceItem, this.state.services.filter(e=>e.id === object.id)[0]);
      serviceItem.is_manicure = object.type;
      price = 0;
      duration = 0;

      selectedServices.push(serviceItem);
      selectedServices.forEach(e=>{
        price += e.price;
        duration += e.duration;
      })
    }
    else {
      price = 0;
      duration = 0;
      /** remove removed item */
      selectedServices = selectedServices.filter(e => !(e.id === object.id && e.is_manicure === object.type));
      selectedServices.forEach(e=>{
        price += e.price;
        duration += e.duration;
      })
    }

    if (selectedServices.length > 0)
      duration = duration < 1 ? 1 : duration;
    else if (selectedServices.length === 0)
      duration = 0;

    this.setState({total: {selectedServices: selectedServices, price: price, duration: duration}},
      function(){
        console.log(this.state.total);
    });
  }

  ShowCalendar(data){
    console.log('change ORDER STATE');
    if(data.length > 0){
      /** choose first free time in first free day */
      this.setState({content: 'time', timetable: data, selectedDate: {id: data[0].id, time: data[0].times[0]}}, function () {
        console.log(this.state.selectedDate);

      });
    }
    else {
      this.setState({content: 'time', timetable: data, selectedDate: {id: false}}, function () {
        console.log(this.state.selectedDate);

      });
    }
  }

  ChangeDate(newDate){
    this.setState({selectedDate: newDate}, function () {
      console.log('CAL change date');
      console.log(this.state.selectedDate);
    });
  }

  render(){
    let content;
    if (this.state.content === 'services') {
      content = <div className="order_services">
        <Service
          type = { {value: 1, title: 'МАНИКЮР'}}
          data = {this.state.services}
          image = "'/assets/images/manicure.jpg'"
          selectService={this.SelectService}
          changeServiceItem={this.ChangeServiceItem}
        />
        <Service
          type = { {value: 0, title: 'ПЕДИКЮР'}}
          data = {this.state.services}
          image = "'/assets/images/pedicure.jpg'"
          selectService={this.SelectService}
          changeServiceItem={this.ChangeServiceItem}
        />
      </div>;
    }
    else {
      content = <Calendar
        timetable = {this.state.timetable}
        changeDate = {this.ChangeDate}
        selectedDayID = {this.state.selectedDate.id}
        adminStyle={false}
      />;
    }
    let totalDate = this.state.selectedDate.id ? { day: this.state.timetable.filter(e=>e.id === this.state.selectedDate.id)[0].date, time : this.state.selectedDate.time} : false;

    return(
      <form className="order_component" id="orderForm">
        {content}
        <Total price={this.state.total.price}
               duration={this.state.total.duration}
               services={this.state.total.selectedServices}
               date= {totalDate}
        />
        <Button
          total = {this.state.total}
          date = {this.state.selectedDate}
          showCalendar = {this.ShowCalendar}
        />
      </form>
    );
  }
}

module.exports = Order;