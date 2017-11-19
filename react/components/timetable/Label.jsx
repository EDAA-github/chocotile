const React = require('react');

let days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

class Label extends React.Component{
  render(){
    return(
      <div className="rLabel">
        {days.map((item) => { return <div className="rCell" key={item}>{item}</div>})}
      </div>
    );
  }
}

module.exports = Label;