const React = require('react');


class Day extends React.Component{
  constructor(props){
    super(props);
    this.ChangeDay = this.ChangeDay.bind(this);
  }
  ChangeDay(e){
    // new
    // console.log(this.props.freeDay);
    if (this.props.value !== undefined) {

      if(this.props.date.getMonth() === new Date().getMonth() && this.props.date.getFullYear() === new Date().getFullYear() && this.props.value < new Date().getDate())
        return;

      this.props.setVal(this.props.value, this.props.freeDay);
      console.log('this.props.freeDay');
      console.log(this.props.freeDay);
      let el = document.querySelector('div.rCell.selected');
      el.classList.remove('selected');
      e.target.className += ' selected';
    }
  }

  render(){
    // let sel = (new Date().getDate() === this.props.value && this.props.date.getMonth() === new Date().getMonth() && this.props.date.getFullYear() === new Date().getFullYear()) || (this.props.value === 1 && (this.props.date.getMonth() !== new Date().getMonth() || this.props.date.getFullYear() !== new Date().getFullYear())) ? ' selected': '';
    /** today */
    let tod = (new Date().getDate() === this.props.value && this.props.date.getMonth() === new Date().getMonth() && this.props.date.getFullYear() === new Date().getFullYear()) || (this.props.value === 1 && (this.props.date.getMonth() !== new Date().getMonth() || this.props.date.getFullYear() !== new Date().getFullYear())) ? ' today': '';

    /** first free day */
    let sel = this.props.firstFreeDay ? ' selected': '';

    let freeDay = this.props.freeDay ? ' freeDay': '';
    return(
      <div className={`rCell rDay${freeDay}${sel}${tod}`} onClick={this.ChangeDay}>
        {this.props.value}
      </div>
    );
  }
}

module.exports = Day;