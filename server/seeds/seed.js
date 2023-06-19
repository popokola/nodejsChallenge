const {
    Sequelize,
    DataTypes
} = require('sequelize');

// Define your Sequelize configuration
const sequelize = new Sequelize('testdb', 'postgres', 'postgres', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
});

// Define your model for the "users" table
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Define your seed data objects
const seedData = [{
        name: 'John Doe',
        email: 'john@example.com'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com'
    },
    // ...
];

async function seed() {
    try {
        // Sync the model with the database
        await User.sync({
            force: true
        });

        // Insert seed data into the table
        await User.bulkCreate(seedData);

        console.log('Seed data inserted successfully');

        await sequelize.close();
    } catch (error) {
        console.error('Error seeding the database:', error);
    }
}

seed();