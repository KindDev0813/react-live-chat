import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { useAuth } from '../state/authState';

const useStorage = (file: File, uid: string | undefined) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<null | string>(null);
  const [url, setUrl] = useState<null | string>(null);
  const authUser = useAuth((s) => s.authUser);
  const setAuthUser = useAuth((s) => s.setAuthUser);
  useEffect(() => {
    (async () => {
      if (authUser?.profileImgFileName !== '') {
        await storage.ref(authUser?.profileImgFileName).delete();
      }
    })();

    // references
    const storageRef = storage.ref(file.name);

    storageRef.put(file).on(
      'state_changed',
      (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(percentage);
      },
      (err) => {
        setError(err.message);
      },
      async () => {
        const url = await storageRef.getDownloadURL();
        if (!url) return;

        await db.collection('users').doc(uid).update({
          profileImgUrl: url,
          profileImgFileName: file.name,
        });
        setUrl(url);
        const newAuthUser: any = {
          ...authUser,
          profileImgUrl: url,
          profileImgFileName: file.name,
        };
        setAuthUser(newAuthUser);
      }
    );
  }, [file, uid, authUser, setAuthUser]);

  return { progress, url, error };
};

export default useStorage;
