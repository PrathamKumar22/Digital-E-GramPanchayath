import React from 'react';

const RoleBasedWrapper = ({ allowedRoles, userRole, children }) => {
  // If the user's role isn't in the allowed list, show nothing
  if (!allowedRoles.includes(userRole)) {
    return null; 
  }

  return <>{children}</>;
};

export default RoleBasedWrapper;