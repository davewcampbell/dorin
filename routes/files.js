"use strict";


function save(request, response){}

function getById(request, response){
	response.end("<h1>Not Found</h1>");
}

module.exports.save = save;
module.exports.getById = getById;
