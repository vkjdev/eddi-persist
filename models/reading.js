'use strict';

module.exports = function(sequelize, DataTypes){
	const properties = {
			qOut : {
				type : DataTypes.FLOAT,
				allowNull: false,
			},
			qDump : {
				type : DataTypes.FLOAT,
				allowNull: false,
			},
			ppmOut: {
				type : DataTypes.INTEGER,
				allowNull: false,
			},
			ppmIn:  {
				type : DataTypes.INTEGER,
				allowNull: false,
			},
			ppmRec: {
				type : DataTypes.INTEGER,
				allowNull: false,
			},
			date : {
				type : DataTypes.DATE,
				allowNull : false,
				primaryKey: true,
			}
		},
		methods = {
			freezeTableName: true,
			classMethods : {
				getEarliestOfDate : function(date){
					// return this.max('id')
					// 		.then(id => this.findById(id))
				},
			},
			instanceMethods: {
				
			}
		},
		Reading = sequelize.define('Reading', properties, methods);

	return Reading;
};