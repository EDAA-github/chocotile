import React from 'react'

class Total extends React.Component{
  constructor(props){
    super(props);

  }

  render(){
    let date = this.props.date ? <div className ="total_line"><span>Дата</span><span>{this.props.date.day}</span></div> : '';
    let time = this.props.date ? <div className ="total_line"><span>Время</span><span>{this.props.date.time}:00</span></div> : '';

    let dur = this.props.duration + "";
    return (
      <div className="order_total">
        <div className="total_line"><span>Длительность</span><span>{dur.replace('.',',')}ч.</span></div>
        <div className="total_line"><span>Цена</span><span>{this.props.price}грн.</span></div>
        {date}
        {time}
        <div className="total_line services"><span>Услуги</span><ul>{this.props.services.map((item, ind)=> <li key={ind}>{item.name}</li> )}</ul></div>
      </div>
    );
  }
}

module.exports = Total;