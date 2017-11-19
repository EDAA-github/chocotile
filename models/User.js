let db = require('../db');
let connection = db.connection;

let getUserByNumber = function(number) {
  return new Promise(function (resolve, reject) {

    /** this is security */
    connection.query('SELECT * FROM users WHERE number = ?', [number], function (error, results) {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

let getUserOrders = function(id_user) {
  let orders = [];
  return new Promise(function (resolve, reject) {
    connection.query('SELECT * FROM orders WHERE id_user = ? ORDER BY date , time ASC', [id_user], function (error, results) {
      if (error) {
        reject(error);
      }
      results.forEach(e=>{
        let t = e.date.toLocaleDateString().split(/[-]/);
        orders.push({id: e.id, price: e.price, duration: e.duration, date: `${t[2]}.${t[1]}.${t[0]}`, time: e.time, services:[]})
      });
      resolve(results.map(e=>e.id));
    });
  })
  .then(orders_id => {
    return new Promise(function (resolve, reject) {
      let q = `SELECT services_in_orders.id, services_in_orders.id_order, services.name, services_in_orders.is_manicure FROM services_in_orders inner join services on services.id = services_in_orders.id_service WHERE id_order IN (${orders_id.join(', ')})`;
      // console.log(q);
      connection.query(q, function (error, results) {
        if (error) {
          reject(error);
        }
        orders = orders.map( o => {
          results.forEach( e => {
            if(e.id_order === o.id)
              o.services.push({id: e.id, name: e.name, type: e.is_manicure === 1})
          });
          return o;
        });
        resolve(orders);
      });
    })
  })
  .catch(err => {
    console.log(err);
    return false;
  })
};

let insertUser = function(name, number, password) {
  return new Promise(function (resolve, reject) {
    connection.query("INSERT INTO users (name, number, password) VALUES (?, ?, ?)", [name, number, password], function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result.insertId);
    });
  });
};


exports.getUserByNumber = getUserByNumber;
exports.insertUser = insertUser;
exports.getUserOrders = getUserOrders;
