const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

// create User model
class User extends Model {};

// create fields/columns for User model
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // do not allow duplicate emails in user table            
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4]
            }
        }
    },
    {
        // pass in imported sequelize connection
        sequelize,
        // do not create timestamps (createdAt/updatedAt)  
        timestamps: false,
        // do not pluralize table name
        freezeTableName: true,
        // underscore instead of camel-case
        underscored: true,
        modelName: 'user'
    }
);

module.exports = User;