const User = require('../models/user.model');//exporter mon model pour l'utiliser
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const configs = require('../configs')

exports.register = (req, res) => { //fonction exportable
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    const user = new User({ //instancier un nouvel utilisateur en fonction de ce que l'on reçoit
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        isAdmin : false,
        password : hashedPassword
    });
    user.save()
    //utilisation des promesses .then .catch
        .then((data) => {//dans le cas d'une bonne execution
            res.send({
                user : data, // data c'est un objet
                auth : true,
                isCreated : true 
            })
        })
        .catch((err) => {
            res.status(500).send({
                message : err.message || "Some error occured"
            }) //une eprsonne qui n'est pas logé 403
        })
}


exports.login = (req, res) => { // formulaire de connexion
    User.findOne({"email" : req.body.email})//chercher l'utilisateur par son email
    .then((user) => { //l'utilisateur a été trouvé, je reçois le user
        let passwordValid = bcrypt.compareSync(req.body.password, user.password) //comparer les deux mots de passe, celui qui est pas haché et celui qui est haché
        if(!passwordValid){ //si les mots de passe ne correspondent pas
            res.status(401).send({
                message : err.message || "password not valid",
                auth : false,
                token : null
            })
        }
        let userTocken = jwt.sign({ //on crée un jeton
            id : user._id,
            isAdmin : User.isAdmin
        },
        configs.jwt.secret,
        {
            expiresIn : 86400 //date d'expiration
        }
        )
        res.status(200).send({
            auth : true,
            token : userTocken
        })
        //maintenant que j'ai mon token il faut l'envoyer {auth:true, token : userTocken}

    })
    .catch((err) => res.status(404).send("test"))
}



//get all
exports.getAll = (req, res) => {
    const user = User.find()
    .then((data) => {
        res.send({
            user : data
        })
    })
    .catch((err) => {
        res.status(500).send({
            error: 500,
            message: err.message
        })
    })
}

//get id
exports.getId = (req, res) => {
    const user = User.findById(req.params.id)
    .then((data) => {
        res.send({
            user : data
        })
    })
    .catch((err) => {
        res.status(500).send({
            message : err.message || "Some error occured"
        })
    })
}
//
exports.getUser = (req, res) => {
    console.log(req.user);
    User.findById(req.user.id) //id vient du jwt
    .then(user => {
        res.send({user:user})
    })
    .catch(err => res.status(404).send(err));
}


//update
exports.update = (req, res) => {
    const user = User.findByIdAndUpdate(req.params.id, {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password
    })
    .then(() => {
        User.findById(req.params.id)
            .then((data) => {
                res.send({
                    user : data,
                    update : true
                })
            })
            .catch((err) => {
                res.status(500).send({
                    message : err.message || "Some error occured"
                })
            })
    })
}

//delete
exports.delete = (req, res) => {
    const user = User.findByIdAndDelete(req.params.id)
    .then((data) => {
        res.send({
            delete : true
        })
    })
    .catch((err) => {
        res.status(500).send({
            message : err.message || "Some error occured"
        })
    })
}