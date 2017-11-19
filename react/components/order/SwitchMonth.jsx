const React = require('react');


class SwitchMonth extends React.Component{
  constructor(props){
    super(props);

    this.ClickHandler = this.ClickHandler.bind(this);
    this.thisMonth = this.props.date.month;
    this.thisYear = this.props.date.year;
  }
  ClickHandler(e){
    let month = this.props.operation === '+' ? this.props.date.month + 1 : this.props.date.month - 1;
    let year = this.props.date.year;
    if (year !== this.thisYear || month >= this.thisMonth ) {
      if (month < 0) {
        month = 11;
        year--;
      }
      else if (month > 11) {
        month = 0;
        year++;
      }
      this.props.change({month, year});
    }
  }

  render(){
    return(
      <div onClick={this.ClickHandler} className="rSwitchMonth">
        <div className="arrow"></div>
      </div>
    );
  }
}

module.exports = SwitchMonth;