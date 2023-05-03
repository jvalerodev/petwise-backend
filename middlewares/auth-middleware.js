import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const token = req.cookies['api-token'];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token is missing.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = {
      id: decodedToken.id,
      email: decodedToken.email,
      name: decodedToken.name,
      lastName: decodedToken.lastName
    };

    req.user = user;
  } catch (error) {
    console.log(error);

    return res
      .status(401)
      .json({ error: 'Authentication token is invalid or expired.' });
  }

  return next();
};

export default authMiddleware;
