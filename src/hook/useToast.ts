import { useToast as ChakraUseToast } from '@chakra-ui/react';

// 彈出框-目前聯絡我們那邊寄信成功或失敗會用到
const useToast = () => {
  const toast = ChakraUseToast();

  const showSuccessToast = (description: string, title: string = 'Success') => {
    toast({
      title,
      description,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const showErrorToast = (description: string, title: string = 'Error') => {
    toast({
      title,
      description,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  return { showSuccessToast, showErrorToast };
};

export default useToast;
