import React from 'react';

interface ProfileImageProps {
  url?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ url }) => {
  return (
    <img
      src={url}
      alt={url}
      style={{
        width: '100%',
        objectPosition: 'center',
        objectFit: 'cover',
      }}
    />
  );
};

export default ProfileImage;
