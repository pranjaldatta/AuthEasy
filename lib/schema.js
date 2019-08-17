/**
 * creates schema accordig to specifications
 */


/**
* @private
* module dependencies
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



/**
  * @public
  * @property {list} schema
  * @property {string} schemaName
  * @param {list} fields
*/

function makeSchema(schemaName, fields) {

    //workaround; fix this such that user can directly type dataypes instead of their string equivalents
    datatypes = {
        "String": mongoose.SchemaTypes.String,
        "Number": mongoose.SchemaTypes.Number,
        "Date": mongoose.SchemaTypes.Date,
        "Buffer": mongoose.SchemaTypes.Buffer,
        "Boolean": mongoose.SchemaTypes.Boolean,
        "Mixed": mongoose.SchemaTypes.Mixed,
        "Array": mongoose.SchemaTypes.Array,
        "Map": mongoose.SchemaTypes.Map,
        "ObjectId": mongoose.SchemaTypes.ObjectId,
        "Decimal128": mongoose.SchemaTypes.Decimal128,
    }; //check objectId 

    var schema = new Schema()

    for(let i = 0 ; i < fields.length ; i++){
        
        fieldName = fields[i].name;
        fieldType = fields[i].datatype;

        schema.add({
            fieldName : fieldType
        });
    
    }

    module.exports = mongoose.model(schemaName , schema);
}

