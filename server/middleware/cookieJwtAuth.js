const jwt = require("jsonwebtoken");

exports.cookieJwtAuth = function (req, res, next) {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        res.clearCookie("token");
        res.sendStatus(401);
    }
}