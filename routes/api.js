module.exports = function(api){
    api.get('/users' ,function(req ,res){
    	res.json({get:'users'});
    });
}