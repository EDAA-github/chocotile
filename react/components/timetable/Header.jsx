const React = require('react');
const SwitchMonth = require('./SwitchMonth');

let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

class Header extends React.Component{
  constructor(props){
    super(props);

    this.state = {month: this.props.date.getMonth(), year: this.props.date.getFullYear()};
    this.ChangeMonth = this.ChangeMonth.bind(this);
  }

  ChangeMonth(dat){
    this.setState(dat);
    this.props.changeMY(dat);
  }

  render(){
    return(
      <div className="rHeader">
        <SwitchMonth date={this.state} operation="-" change={this.ChangeMonth} key="-"/>
        { months[this.state.month] + " "}{this.state.year}
        <SwitchMonth date={this.state} operation="+" change={this.ChangeMonth} key="+"/>
      </div>
    );
  }
}

module.exports = Header;