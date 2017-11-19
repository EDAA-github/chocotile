const React = require('react');
const Header = require('./Header');
const Label = require('./Label');
const Month = require('./Month');
const TimeItem = require('./TimeItem');

class Calendar extends React.Component{
  constructor(props){
    super(props);
    this.state = { date: new Date(), selectedDate: {id: false} };
    this.ChangeMonthYear = this.ChangeMonthYear.bind(this);
    this.ChangeDay = this.ChangeDay.bind(this);

    /** on time click handler */
    this.ChangeTime = this.ChangeTime.bind(this);


    if(this.props.timetable.length > 0){
      /** first time in first day */
      if(!this.props.adminStyle)
        this.state.selectedDate = { id : this.props.timetable[0].id, time : this.props.timetable[0].times[0]};
      else
        this.state.selectedDate = { id : this.props.timetable[0].id, time : this.props.timetable[0].times[0].hour};

    }
    console.log('CAl PROPS');
    console.log(this.props.timetable);

    // if(!this.props.adminStyle)
    //   this.state.selectedDate = { id : this.props.timetable[0].id, time : this.props.timetable[0].times[0]};
    // else
    //   this.state.selectedDate = { id : this.props.timetable[0].id, time : this.props.timetable[0].times[0].hour};
    // this.state.selectedDate = { id : this.props.timetable[0].id, time : this.props.timetable[0].times[0]};


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
    console.log('firstDayInNewMonth');
    console.log(firstDayInNewMonth);
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
    // если есть freeDay
    // в стейт вставить первое время из этого дня
    // создать список всех времен дня
    // и изменить его соответственно для выбранного дня
    let newDate = {id: false};
    if(freeDay) {
      let firstTimeInFreeDay = this.props.timetable.filter(e => e.id === freeDay)[0].times[0];
      newDate = { id: freeDay, time: firstTimeInFreeDay};
    }
    this.setState({date: dt, selectedDate: newDate}, function () {
      this.props.changeDate(this.state.selectedDate);
    });
  }
  ChangeTime(time){
    this.setState(function (prev, props) {
      return { selectedDate: { id: prev.selectedDate.id, time: time } }
    }, function () {
      this.props.changeDate(this.state.selectedDate);
    });
    // this.setState({selectedDate: {time:time}}, function () {
    //   this.props.changeDate(this.state.selectedDate);
    // });
  }
  render(){
    let times;
    if(this.state.selectedDate.id){
      let thatDay = this.props.timetable.filter(e => e.id === this.state.selectedDate.id)[0];
      if(!this.props.adminStyle) {
        times = thatDay.times.map(e => <TimeItem key={e} click={this.ChangeTime} value={e}/>);
      }
    }
    else{
      times = <p>Мастер в этот день занят</p>
    }

    return(
      <div className="order_time">
        <div id="calendar-component">
          <Header date = {this.state.date} changeMY={this.ChangeMonthYear}/>
          <Label/>
          <Month date = {this.state.date} changeDay={this.ChangeDay} timetable={this.props.timetable} selectedDayID = {this.props.selectedDayID}/>
          <input type="hidden" value={this.state.date.toLocaleDateString()} name="calendar"/>
          <div className="rBottomBorder"/>
          <div className="rBottomBorder"/>
        </div>
        <div className="calendar_times">
          <div className="calendar_times_header">Выберите время</div>
          <div className="calendar_times_content">
            {times}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Calendar;