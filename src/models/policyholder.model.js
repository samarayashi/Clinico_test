module.exports = (sequelize, Sequelize) => {
  const Policyholder = sequelize.define('policyholder', {
    code: {
      type: Sequelize.STRING(10),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    registration_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    introducer_code: {
      type: Sequelize.STRING(10),
      allowNull: true,
      references: {
        model: 'policyholders',
        key: 'code'
      }
    }
  }, {
    timestamps: false,
    tableName: 'policyholders',
    schema: 'public'
  });

  // 自關聯關係
  Policyholder.associate = (models) => {
    Policyholder.belongsTo(Policyholder, { 
      foreignKey: 'introducer_code', 
      as: 'introducer' 
    });
    
    Policyholder.hasMany(Policyholder, { 
      foreignKey: 'introducer_code', 
      as: 'introduced' 
    });
  };

  return Policyholder;
}; 