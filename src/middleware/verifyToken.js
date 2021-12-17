//middleware : une fonction que tu places au milieur de deux opérations
const jwt = require ('jsonwebtoken');

function verifyToken (req, res, next) {  //fonction réutilisable, peut agir en tant que controller
    let token = req.headers.test//récupérer le token qui est dans le header de la requête dans le libellé authorization
    console.log(token);
    if (!token) { // est ce que on a un token, si il est bon ou pas
        
        return res.status(403).send({
            auth : false,
            token : null,
            message : 'Missing token'
        })
    }
    jwt.verify(token, process.env.JWT_SECRET, //on verifie le token, 1er paramètre : le token, 2ème paramètre la signature
    function(error, jwtdecoded) { //user pas valide / il a expiré, jswtdecoded : infos du jwt qui sont décodées (idadmin et id de l'utilisateur)
        console.log('testd')
        if (error) {
            return res.status(401).send({
                auth : false,
                token : null,
                message : "not authorized"
            })
        }
        req.user = jwtdecoded//rajouter dans ma requête une propriété user et à l'intérieur je mets le jwtdecoded
        next(); // passe à l'exécution suivante
        })
}

module.exports = verifyToken;