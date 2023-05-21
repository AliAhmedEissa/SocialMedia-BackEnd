

export const setLanguage = async (req, res, next) => {
  
    var acceptLanguage = req.headers['accept-language']
    if(!acceptLanguage) acceptLanguage = "en"
    process.env.lang = acceptLanguage
    next()
};

export default setLanguage;
