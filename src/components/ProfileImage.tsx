import React, { useEffect, useState } from 'react';
import FallbackProfileImage from './FallbackProfileImage';

interface ProfileImageProps {
  url?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ url }) => {
  // const imgRef = useRef<HTMLImageElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    (async () => {
      if (url) {
        const res = await fetch(url);
        if (!res.ok) setShow(false);
      }
    })();
  }, [url]);

  if (!url) {
    return <FallbackProfileImage />;
  }

  return (
    <>
      {show ? (
        <img
          // ref={imgRef}
          src={url}
          alt={url}
          style={{
            objectPosition: 'center',
            objectFit: 'cover',
            height: '100%',
            width: 'auto',
          }}
        />
      ) : (
        <FallbackProfileImage />
      )}
    </>
  );
};

export default ProfileImage;
