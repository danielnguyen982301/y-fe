import axios from 'axios';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from './config';
import { jwtDecode } from 'jwt-decode';

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return (decoded.exp as number) > currentTime;
};

export const cloudinaryUpload = async (image: File) => {
  try {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET as string);
    const response = await axios({
      url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const imageUrl = response.data.secure_url;
    return imageUrl;
  } catch (error) {
    throw error;
  }
};

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const transformedDateAndTime = (dateString: string) => {
  const date = new Date(dateString);
  const currentDate = new Date();
  const timeDiff = Date.now() - date.getTime();
  const transformedTime =
    timeDiff < 1000 * 60
      ? `${Math.floor(timeDiff / 1000)}s`
      : timeDiff < 1000 * 60 * 60
      ? `${Math.floor(timeDiff / (1000 * 60))}m`
      : timeDiff < 1000 * 60 * 60 * 24
      ? `${Math.floor(timeDiff / (1000 * 60 * 60))}h`
      : currentDate.getFullYear() === date.getFullYear()
      ? date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      : date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
  return transformedTime;
};
