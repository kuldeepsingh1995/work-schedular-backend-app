const db = require("../models");
const ClassYear = db.class_years;
const Op = db.Sequelize.Op;
const randomIdGen = require('../helpers/random-id');
const seq_error_helper = require('../helpers/seq_error.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// export Worker
exports.exportToCsvFunc =  (req, res) => {
  console.log('function start     .....................................')
  ClassYear.findAll(
    {
      raw: true
    }
  ).then(function(data) {
    console.log(data, 'data.....................................')
    const ramdomId = randomIdGen.randomId(10);
    const csvWriter = createCsvWriter({
      path: './uploads/'+ramdomId+'.csv',
      header: [
        {id: 'id', title: 'Id'},
        {id: 'title', title: 'Title'},
        {id: 'created_at', title: 'Created At'},
        {id: 'updated_at', title: 'Updated At'},
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
        title:req.body.title, 
  };

  if(req.body.id){
 
  let id = req.body.id;
  ClassYear.update(StoreObj, {
    where: { id: req.body.id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message:"Class Year was updated Successfully.",
          status: 'success',
          data: StoreObj
        });
      } else {
        res.send(
          {
            message: `Cannot update Class Year with id=${id}. Maybe Class Year was not found or req.body is empty!`,
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
          message: "Error updating Class Year with id=" + id,
          status: 'fail',
          data: {}
        });
    });

  }else{
  // Save Worker in the databas

  ClassYear.create(StoreObj)
    .then(data => {
     
      res.status(200).send({
        message:"Class Year Created Successfully.",
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
  console.log(page , 'page')
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
    ClassYear.findAndCountAll(condition)
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
          message: err.message || "Some error occurred while retrieving Class Year."
        }
        );
    });
   }, 500);

};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  ClassYear.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Class Year with id=" + id
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  ClassYear.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Class Year was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Class Year with id=${id}. Maybe Class Year was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Class Year with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.body.ids;

  ClassYear.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num > 0) {
        res.send({
          message: "Class Year was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Class Year with id=${id}. Maybe Class Year was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Class Year with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  ClassYear.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Class Year were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Class Year."
      });
    });
};

