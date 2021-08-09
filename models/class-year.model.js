module.exports = (sequelize, Sequelize) => {
  const ClassYear = sequelize.define("class_years", {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Class year already in use!'
        }
      },
    },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return ClassYear;
};