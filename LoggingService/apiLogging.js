const fs = require('fs');
const promisify = require('util').promisify;

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const port = process.argv[2] || 5002;

let app = express();
let router = express.Router();

const Logger = require('./loggerService').Logger;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', router);

let logger = new Logger();

router.route('/activate').post(function(req, res, next){
    logger.activate().then(() => {
    	res.status(200);
    	res.json({});
		console.log("Log activado!");
		logger.log("Log activado!")	
    });
})

router.route('/deactivate').post(function(req, res, next){
    logger.deactivate().then(() => {
    	res.status(200);
    	res.json({});
		console.log("Log desactivado!");
		logger.log("Log desactivado!")    	
    });
})

router.route('/unqfyStatus').get(function(req, res, next){
	logger.getStatusOfUNQfy().then((response) => {
		res.status(200);
		res.json({});
		console.log("Unqfy no se encuentra activado");
		logger.log("Unqfy no se encuentra activado");
	}).catch(error => {
		res.status(200);
		res.json({});
		console.log("Unqfy se encuentra activado");
		logger.log("Unqfy se encuentra activado");
	});
})

router.route('/notifierStatus').get(function(req, res, next){
	logger.getStatusOfNotifier().then(() => {
		res.status(200);
		res.json({});
		console.log("El sistema de notificacion no se encuentra activado");
		logger.log("El sistema de notificacion no se encuentra activado");
	}).catch(error => {
		res.status(200);
		res.json({});
		console.log("El sistema de notificacion se encuentra activado");
		logger.log("El sistema de notificacion se encuentra activado");
	});
})

router.route('/log').post(function(req, res, next){
	const data = req.body;
	logger.getStatus().then(response => {
		if(response){
			logger.log(data.text).then(() => {
				res.status(200);
				res.json({
					information: "Log enviado a Slack!"
				});
			});
		}
	})
	
})

app.listen(port, () => console.log('Listening on ' + port));