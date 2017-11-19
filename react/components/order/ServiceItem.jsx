import React from 'react'

class ServiceItem extends React.Component{
  constructor(props){
    super(props);

    /** change checkbox values */
    this.serviceItem_ChageCheck = this.serviceItem_ChageCheck.bind(this);
  }

  serviceItem_ChageCheck(e){
    // console.log(e.target.checked);
    // console.log(this.props);
    this.props.service_changeServiceItem({id: this.props.id, isChosen: e.target.checked})
  }

  render(){
    console.log(this.props.checked);
    return (
      <label className="service_item">
        <input type="checkbox" defaultChecked={this.props.checked} onChange={this.serviceItem_ChageCheck}/>
        <span className="box"></span>
        {this.props.name}
      </label>
    );
  }
}

module.exports = ServiceItem;