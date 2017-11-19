const React = require('react');
const Day = require('./Day');

class Month extends React.Component{
  constructor(props){
    super(props);
    this.state = {value : this.props.date.getDate()};
    this.SetValue = this.SetValue.bind(this);
    this.thisDay = this.props.date.getDate();
    this.thisMonth = this.props.date.getMonth();
    this.thisYear = this.props.date.getFullYear();

  }
  SetValue(val, freeDay){
    if(this.props.date.getMonth() === this.thisMonth && this.props.date.getFullYear() === this.thisYear && val < this.thisDay)
      return;
    this.setState({value : val});
    this.props.changeDay(val, freeDay);
    // console.log(freeDay);
  }

  render(){

    let dt = this.props.date;
    let maxDay = new Date(dt.getFullYear(), dt.getMonth()+1, 0).getDate();
    dt.setDate(1);

    let firstDayOfWeek = dt.getDay() - 1;
    firstDayOfWeek = firstDayOfWeek === -1 ? 6: firstDayOfWeek;

    /** unable days for better view */
    let addedDaysCount = 7-(maxDay +firstDayOfWeek)%7;
    addedDaysCount = addedDaysCount === 7 ? 0 : addedDaysCount;

    return(
      <div className="rMonth">

        {/** unable days before month */}
        { Array.apply(null, {length: firstDayOfWeek}).map((item, index) => <Day  key={index} />) }

        {/** real days */}
        { Array.apply(null, {length: maxDay}).map((item, index) => {
          {/*let freeDay = this.props.timetable.filter( e => e.date === new Date(dt.getFullYear(), dt.getMonth(), index + 1).toLocaleDateString());*/}
          let freeDay = this.props.timetable.filter( e => e.date === `${index + 1}.${dt.getMonth() + 1}.${dt.getFullYear()}`);


          let selectedFirstFreeDay = false;
          if(freeDay.length === 1) {
            selectedFirstFreeDay = this.props.selectedDayID === freeDay[0].id;
          }
          freeDay = freeDay.length === 1 ? freeDay[0].id: false;
          return  <Day
            key = {index+firstDayOfWeek}
            value = {index+1}
            setVal = {this.SetValue}
            date = {this.props.date}
            freeDay = { freeDay }
            firstFreeDay = {selectedFirstFreeDay}
          />}) }

        {/** unable days after month */}
        { Array.apply(null, {length: addedDaysCount}).map((item, index) => <Day  key={index+firstDayOfWeek+maxDay} />) }

      </div>
    );
  }
}

module.exports = Month;