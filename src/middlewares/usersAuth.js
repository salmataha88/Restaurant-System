export const isSuperAdmin = () => {
    return (req, res, next) => {
      if (req.authUser.email !== process.env.SuperAdminEmail) {
        return res.status(403).json({ message: 'Super Admin access required' });
      }
      next();
    };
};

export const isAdmin = () => {
    return (req, res, next) => {
      if (req.authUser.role !== 'Admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
    };
};

export const is_Staff_Admin = () => {
    return (req, res, next) => {
      if (req.authUser.role == 'User') {
        return res.status(403).json({ message: 'Staff or Admin access required' });
      }
      next();
    };
};

export const isUser = () => {
    return (req, res, next) => {
      if (req.authUser.role !== 'User') {
        return res.status(403).json({ message: 'User access required' });
      }
      next();
    };
};