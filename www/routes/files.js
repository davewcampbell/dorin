 "use strict";

var _ = require("lodash");
var path = require("path");

function save(request, response){

	var savedUrl = request.protocol + '://' + request.get('host') + "/file/" + request.files.file.name;
	response.status(201).end(savedUrl);
}

function getById(request, response){
	
	response.sendFile(request.params.id, { root: path.join(__dirname, '../uploads') });
}

module.exports.save = save;
module.exports.getById = getById;
