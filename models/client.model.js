module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define("client", {
      name: {
        type: Sequelize.STRING
      },
      business_id_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_person_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_person_phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_person_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accounting_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },   
      accounting_phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },   
      accounting_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },         
    },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
  
    return Client;
  };