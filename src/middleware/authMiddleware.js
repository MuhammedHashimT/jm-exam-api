const jwt = require('jsonwebtoken');
const Institution = require('../models/Institution');

// JWT authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Institution authentication middleware
const institutionAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'institution') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Institution authentication required.' 
      });
    }

    const institution = await Institution.findById(decoded.id);
    if (!institution) {
      return res.status(401).json({ 
        success: false, 
        message: 'Institution not found.' 
      });
    }

    if (!institution.verified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Institution not verified. Please wait for admin approval.' 
      });
    }

    req.institution = institution;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin authentication required.' 
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

module.exports = {
  auth,
  institutionAuth,
  adminAuth
};