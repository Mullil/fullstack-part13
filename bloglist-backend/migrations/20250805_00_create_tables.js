const { Sequelize, DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('blogs', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      author: {
        type: DataTypes.STRING,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      year: {
        type: DataTypes.INTEGER,
        validate: {
          maxCurrentYear(value) {
            const currentYear = new Date().getFullYear();
            if (value > currentYear) {
              throw new Error('Year cannot be greater than the current year');
            }
          }
        }
      },
      created_at: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: Sequelize.fn('NOW')
      }
    })
    await queryInterface.createTable('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn('NOW')
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn('NOW')
        }
    })
    await queryInterface.addColumn('blogs', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'user_id')
    await queryInterface.dropTable('blogs')
    await queryInterface.dropTable('users')
  },
}