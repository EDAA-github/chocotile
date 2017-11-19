const React = require('react');
const Header = require('./Header');
const Label = require('./Label');
const Month = require('./Month');
const TimeItem = require('./TimeItem');

class Calendar extends React.Component{
  constructor(props){
    super(props);
    this.state = { date: new Date(), selectedDate: {id: false}, timetable: this.props.timetable };
    this.ChangeMonthYear = this.ChangeMonthYear.bind(this);
    this.ChangeDay = this.ChangeDay.bind(this);


    if(!this.state.selectedDate.id){
      /** first time in first day */
      this.state.selectedDate = { id : this.props.timetable[0].id};
    }
  }


  ChangeMonthYear(my){
    let dt = this.state.date;
    dt.setFullYear(my.year);
    dt.setMonth(my.month);
    if(my.month === new Date().getMonth())
      dt.setDate(new Date().getDate());
    // this.setState({date: dt});

    /* при переходе на новый месяц нужно удалять выделенный день и выделять 1 в месяце*/
    // let el = document.querySelector('div.rCell.selected');
    // if(el)
    //   el.classList.remove('selected');


    // console.log(this.props.timetable);
    let firstDayInNewMonth = this.props.timetable.filter(e => parseInt(e.date.split('.')[1]) === (my.month+1))[0];

    let newSelDate = {id: false};
    if(firstDayInNewMonth){
      newSelDate = {id: firstDayInNewMonth.id, time: firstDayInNewMonth.times[0]};
    }
    this.setState({date: dt, selectedDate: newSelDate}, function () {
      this.props.changeDate(this.state.selectedDate);
    });

  }


  ChangeDay(d, freeDay){
    let dt = this.state.date;
    dt.setDate(d);

    this.setState({date: dt, selectedDate: {id: freeDay}}, function () {

    });
  }

  render(){
    let times;
    if(this.state.selectedDate.id){
      let thatDay = this.props.timetable.filter(e => e.id === this.state.selectedDate.id)[0];

      times = thatDay.times.map(e =>{
        let type = -1;
        if(e.val === 0){
          type = 0;
        }
        else if (e.val > 0) {
          type = 1;
        }
        return <TimeItem key={e.hour} type={type} dayDate={thatDay.date} dayID={thatDay.id}  value={e} />;
      });

    }
    else{
      times = <p>Выберите день</p>
    }

    return(
      <div className="order_time">
        <div id="calendar-component">
          <Header date = {this.state.date} changeMY={this.ChangeMonthYear}/>
          <Label/>
          <Month date = {this.state.date} changeDay={this.ChangeDay} timetable={this.props.timetable} selectedDayID = {this.state.selectedDate.id}/>
          <input type="hidden" value={this.state.date.toLocaleDateString()} name="calendar"/>
          {/*<div className="rBottomBorder"/>*/}
          {/*<div className="rBottomBorder"/>*/}
        </div>
        <div className="calendar_times">
          <div className="calendar_times_header">Расписание</div>
          <div className="calendar_times_content">
            {times}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Calendar;