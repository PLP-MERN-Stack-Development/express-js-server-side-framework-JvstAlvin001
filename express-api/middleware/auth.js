const auth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === 'mysecretkey') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized Invalid API key' });
    }
};

module.exports = auth;