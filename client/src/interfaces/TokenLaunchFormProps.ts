import React from 'react';
import { FormData } from './FormData';


export interface TokenLaunchFormProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  }
  