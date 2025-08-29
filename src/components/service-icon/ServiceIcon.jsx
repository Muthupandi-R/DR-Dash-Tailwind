import React from 'react'
import { getIcon } from '../../utils/iconMap';

const ServiceIcon = ({ cloud, serviceType }) => {
   const iconSrc = getIcon(cloud, serviceType);
    return iconSrc ? (
      <img src={iconSrc} alt={`${cloud}-${serviceType}`} className="w-4 h-4" />
    ) : (
      <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
    );
}

export default ServiceIcon
