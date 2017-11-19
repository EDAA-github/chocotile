import React from 'react';
import ServiceItem from './ServiceItem';

class Service extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      isSelected : false
    };

    /** Choose this type of service */
    this.service_SelectService = this.service_SelectService.bind(this);

    /** add type field to selected/unselected service item */
    this.serviceAddType = this.serviceAddType.bind(this);
  }

  service_SelectService(e){
    if(!this.state.isSelected){
      e.target.parentNode.parentNode.parentNode.classList.add('selected');
    }
    else {
      e.target.parentNode.parentNode.parentNode.classList.remove('selected');
      e.target.parentNode.parentNode.parentNode.lastChild.removeAttribute('open');
    }
    this.setState(prevState => ({ isSelected : !prevState.isSelected }), ()=>{
      this.props.selectService({type: this.props.type.value, isSelected: this.state.isSelected});
    })
  }

  serviceAddType(object){
    object.type = this.props.type.value;
    this.props.changeServiceItem(object);
  }
  render(){

    return (
      <div className = "order_service">
        <div className="order_service_rhomb">
          <div className="order_service_content"  style={{backgroundImage: `url(${this.props.image})`}}>
            <h2 onClick={this.service_SelectService}>{this.props.type.title} <span className="line line-first"></span><span className="line line-second"></span></h2>
          </div>
        </div>
        <details className="showSettings">
          <summary>
            Настроить
          </summary>
          <div className="showSettings_content">
            {this.props.data.map(e=><ServiceItem service_changeServiceItem={this.serviceAddType} id={e.id} key={e.id} name={e.name} checked={e.default} duration={e.duration} price={e.price}/>)}
          </div>
        </details>

      </div>
    );
  }
}

module.exports = Service;