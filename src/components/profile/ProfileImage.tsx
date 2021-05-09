import React from 'react';
import FallbackProfileImage from './FallbackProfileImage';

interface ProfileImageProps {
  url: string | undefined;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ url }) => {
  if (!url || url === 'undefined') {
    return <FallbackProfileImage />;
  }

  return (
    <img
      src={url}
      alt="Fallback Img"
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
