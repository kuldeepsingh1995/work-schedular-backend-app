const db = require("../models");
const Client = db.client;
const Op = db.Sequelize.Op;

const randomIdGen = require('../helpers/random-id');
const seq_error_helper = require('../helpers/seq_error.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;



  
  // export Worker
  exports.exportToCsvFunc =  (req, res) => {
    Client.findAll(
      {
        raw: true
      }
    ).then(function(data) {
      const ramdomId = randomIdGen.randomId(10);
      const csvWriter = createCsvWriter({
        path: './uploads/'+ramdomId+'.csv',
        header: [
          {id: 'business_id_number', title: 'Business Id Number'},
          {id: 'name', title: 'name'},
          {id: 'address', title: 'address'},
          {id: 'fullname', title: 'fullname'},
          {id: 'contact_person_name', title: 'contact_person_name'},
          {id: 'contact_person_email', title: 'contact_person_email'},
          {id: 'contact_person_phone', title: 'contact_person_phone'},
          {id: 'accounting_name', title: 'accounting_name'},
          {id: 'accounting_phone', title: 'accounting_phone'},
          {id: 'accounting_email', title: 'accounting_email'},
          {id: 'description', title: 'description'},
          {id: 'created_at', title: 'created_at'},
          {id: 'updated_at', title: 'updated_at'},
        ],
      }); 
      csvWriter
        .writeRecords(data)
        .then(()=> console.log('The CSV file was written successfully'));
        res.send({
          data: 'uploads/'+ramdomId+'.csv',
          status: 'success',
          message: 'data exported successfully'
        });
    });
  
  }
  
  // Create and Save a new Worker
  exports.create = (req, res) => {
    // Validate request
    
    // Create a Worker
    const StoreObj = {
          business_id_number: req.body.business_id_number,
          name: req.body.name,
          address: req.body.address,
          fullname	: req.body.fullname	,
          contact_person_name: req.body.contact_person_name,
          contact_person_phone: req.body.contact_person_phone,
          contact_person_email: req.body.contact_person_email,
          accounting_name: req.body.accounting_name,
          accounting_phone: req.body.accounting_phone, 
          accounting_email: req.body.accounting_email 
    };
  
    if(req.body.id){
   
    let id = req.body.id;
    Client.update(StoreObj, {
      where: { id: req.body.id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message:"Client was updated Successfully.",
            status: 'success',
            data: StoreObj
          });
        } else {
          res.send(
            {
              message: `Cannot update Client with id=${id}. Maybe Client was not found or req.body is empty!`,
              status: 'fail',
              data: {}
            }
          );
        }
      })
      .catch(err => {
        console.log(err, 'err')
        res.status(500).send(
          {
            message: "Error updating Client with id=" + id,
            status: 'fail',
            data: {}
          });
      });
  
    }else{
    // Save Worker in the databas
  
    Client.create(StoreObj)
      .then(data => {
       
        res.status(200).send({
          message:"Client Created Successfully.",
          status: 'success',
          data: data
        });
      })
      .catch(err => {
        const sql_messages = seq_error_helper.getSeqError(err);
        res.status(500).send({
          message:  (err.message || "Some error occurred."),
          status: 'fail',
          data: {},
          sql_errors: sql_messages
        });
      });
    }
  };
  
  const getPagingData = (data_, page, limit) => {
    const { count: totalItems, rows: data } = data_;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, data, totalPages, currentPage };
  };
  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? (page-1) * limit : 0;
  
    return { limit, offset };
  };
  // Retrieve all Worker from the database.
  exports.findAll = (req, res) => {
    const { page, size } = req.body;
    const { limit, offset } = getPagination(page, size);
    const title = req.body.title;
    var condition = {};
    
  
    if (Object.keys(req.body.whereLike).length !== 0 && req.body.whereLike.constructor === Object) {
      let where_like_obj = req.body.whereLike;
      let new_where_like_obj = {...where_like_obj};
      for (const property in where_like_obj) {
        new_where_like_obj[property] = {[Op.like]: `%${where_like_obj[property]}%` };
      }
      condition.where = new_where_like_obj;
     };
  
     if (Object.keys(req.body.where).length !== 0 && req.body.where.constructor === Object) {
  
      if(condition.where===undefined){
        condition.where = req.body.where;
      } else {
        condition.where = {...req.body.where, ...condition.where};
      }
      
     };
  
     if (Object.keys(req.body.orderBy).length === 0 && req.body.orderBy.constructor === Object) {
      req.body.orderBy = {
        id: false,
      }
     }
     if (Object.keys(req.body.orderBy).length !== 0 && req.body.orderBy.constructor === Object) {
      
      for (const orderKey in req.body.orderBy) {
        req.body.orderBy[orderKey] = req.body.orderBy[orderKey] ? 'ASC' : 'DESC';
      } 
      let formatOrderBy =  Object.entries(req.body.orderBy);
  
       condition.order = formatOrderBy;
     }
     condition.limit = size;
     condition.offset =  offset;
     setTimeout(() => {
      Client.findAndCountAll(condition)
      .then(data => {
        const response = getPagingData(data, page, limit);
  
        res.send({
          data: response,
          status: 'success',
          message: 'data retreived successfully'
        });
      })
      .catch(err => {
        res.status(500).send(
          {
            data: [],
            status: 'fail',
            message: err.message || "Some error occurred while retrieving Client."
          }
          );
      });
     }, 500);
  
  };
  
  // Find a single Tutorial with an id
  exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Client.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Client with id=" + id
        });
      });
  };
  
  // Update a Tutorial by the id in the request
  exports.update = (req, res) => {
    const id = req.params.id;
  
    Client.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Client was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Client with id=${id}. Maybe Client was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Client with id=" + id
        });
      });
  };
  
  // Delete a Tutorial with the specified id in the request
  exports.delete = (req, res) => {
    const id = req.body.ids;
  
    Client.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num > 0) {
          res.send({
            message: "Client was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Client with id=${id}. Maybe Client was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Client with id=" + id
        });
      });
  };
  
  // Delete all Tutorials from the database.
  exports.deleteAll = (req, res) => {
    Client.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Client were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all Client."
        });
      });
  };
  
  