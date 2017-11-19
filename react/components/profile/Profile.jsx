import React from 'react'


class Profile extends React.Component{

  constructor(props){
    super(props);
    this.state = {orders : [], upcomingOrders:[], oldOrders:[]};
  }
  componentDidMount() {
    /** get user orders */
    fetch('profile/user-orders',{
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      }})
    .then(res => res.json())
    .then(data => {
      if('error' in data){
        niceAlert(data.error);
        return;
      }
      this.setState({orders: data}, function () {
        console.log(this.state);
        let now = new Date();
        let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let upcomingOrders = [];
        let oldOrders = [];
        this.state.orders.forEach(e => {
          let dateParts = e.date.split('.');
          let dateOrder = new Date(dateParts[2], parseInt(dateParts[1])-1, dateParts[0]);
          if(dateOrder >= today){
            upcomingOrders.push(e);
          }
          else {
            oldOrders.push(e);
          }

        });
        this.setState({upcomingOrders:upcomingOrders, oldOrders:oldOrders}, function () {
          console.log(this.state);
        });
      });
    })
    .catch(err => {
      console.log(err);
    })
  }

  render(){
    let content_upcomingOrders = '';
    let content_oldOrders = '';
    if(this.state.upcomingOrders.length > 0){
      content_upcomingOrders =
      <div className="upcomingOrders orders">
        <h2 className="orders_header">БЛИЖАЙШИЕ ЗАПИСИ</h2>
        <div className="div_list_container">
          {this.state.upcomingOrders.map( e =>
             <details key={e.id}>
              <summary><span>{e.price}грн</span> <span>{e.date}</span> <span>{e.time}:00</span> </summary>
              <div className="desc">{e.services.map(s=> {
                let img = "url('/assets/images/";
                img += s.type ? "manicure.svg')" : "pedicure.svg')";
                return <div className="service_item" key={s.id} > <span className="imgType" style={{backgroundImage: img}}></span>  {s.name} </div>;
                }
              )}</div>
            </details>
          )}
        </div>
      </div>;
    }
    if(this.state.oldOrders.length > 0){

      // content_oldOrders = <div className="oldOrders orders"><h2 className="orders_header">НЕДАВНИЕ ЗАПИСИ</h2><div className="div_list_container">{this.state.oldOrders.map(e=><details key={e.id}> {e.price} </details>)}</div></div>;
      content_oldOrders =
        <div className="upcomingOrders orders">
          <h2 className="orders_header">НЕДАВНИЕ ЗАПИСИ</h2>
          <div className="div_list_container">
            {this.state.oldOrders.map( e =>
              <details key={e.id}>
                <summary><span>{e.price}грн</span> <span>{e.date}</span> <span>{e.time}:00</span> </summary>
                <div className="desc">{e.services.map(s=> {
                    let img = "url('/assets/images/";
                    img += s.type ? "manicure.svg')" : "pedicure.svg')";
                    return <div className="service_item" key={s.id}> <span className="imgType" style={{backgroundImage: img}}></span> {s.name} </div>;
                  }
                )}</div>
              </details>
            )}
          </div>
        </div>;
    }
    return (
      <div>
        {content_upcomingOrders}
        {content_oldOrders}
      </div>
    )
  }
}

module.exports = Profile;