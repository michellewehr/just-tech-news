const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');


//create our user model
class User extends Model {
    //set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

//define table columns and configuration
User.init(
    {
        //Table column definitions go here
        //define an id column 
        id: {
            //use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            //this is the equivalent of SQL's 'Not NULL' option
            allowNull: false,
            //instruct that this is the Primary key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        }, 
        //define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be any duplicate email values in this table
            unique: true,
            //if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        //define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
    //Table Configuration options go here (https://sequelize.org/v5/manual/models-definition.html#configuration))
   
    hooks: {
        // set up beforeCreate lifecycle "hook" functionality
        async beforeCreate(newUserData) {
          newUserData.password = await bcrypt.hash(newUserData.password, 10);
          return newUserData;
        },
         // set up beforeUpdate lifecycle "hook" functionality for updated user password
        async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
        }
    },
    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
  }
);

module.exports = User;

// First, we imported the Model class and DataTypes object from Sequelize. This Model class is what we create our own models from using the extends keyword so User inherits all of the functionality the Model class has.

// Once we create the User class, we use the .init() method to initialize the model's data and configuration, passing in two objects as arguments. The first object will define the columns and data types for those columns. The second object it accepts configures certain options for the table. Learn more in the Sequelize documents for model configuration (Links to an external site.).

//The .init() method we execute after is the part that actually provides context as to how those inherited methods should work.