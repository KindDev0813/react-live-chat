import { Progress } from '@chakra-ui/progress';
import { useToast } from '@chakra-ui/toast';
import React, { useEffect } from 'react';
import useStorage from '../hooks/useStorage';

interface ProgressBarProps {
  file: File;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  uid: string | undefined;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ file, setFile, uid }) => {
  const toast = useToast();
  const { url, progress } = useStorage(file, uid);

  useEffect(() => {
    if (url) {
      toast({
        status: 'success',
        duration: 3000,
        title: 'Profile updated',
        isClosable: true,
      });
      setFile(null);
    }
  }, [url, setFile, toast]);
  return <Progress mt="5" width="100%" hasStripe value={progress} />;
};

export default ProgressBar;
