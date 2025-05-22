const extractOrganizationName = (req, res, next) => {
  const { organizationName } = req.query;
  console.log(organizationName)
  
    if (!organizationName) {
      return res.status(400).json({ message: 'Organization name is required' });
    }
  
    // Attach the organization name to the request object
    req.organizationName = organizationName;
  
    next();
  };
  
export default extractOrganizationName;