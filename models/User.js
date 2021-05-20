const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

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
            allowNull: false,
            // do not allow duplicate emails in user table 
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,           
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
        hooks: {
            // hash user password before creating user object
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // hash user password before updating user object
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
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