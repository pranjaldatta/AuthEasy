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
  * @param {list} fields //{
  * fieldname : datatype
  * }
*/

function makeSchema(schemaName, fields) {
    
    var schema = new Schema(fields)

    module.exports.model = mongoose.model(schemaName , schema);
}

module.exports = makeSchema;

