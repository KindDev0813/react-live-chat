import React from 'react';
import FallbackProfileImage from './FallbackProfileImage';

interface ProfileImageProps {
  url?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ url }) => {
  if (!url) {
    return <FallbackProfileImage />;
  }

  return (
    <img
      src={url}
      alt={url}
      style={{
        objectPosition: 'center',
        objectFit: 'cover',
        height: '100%',
        width: 'auto',
      }}
    />
  );
};

export default ProfileImage;
