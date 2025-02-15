import { FormData } from '../interfaces/FormData'; // Assuming you have a FormData interface

export const addWalletRow = (formData: FormData, setFormData: React.Dispatch<React.SetStateAction<FormData>>) => {
  if (formData.walletRows.length < 20) {
    setFormData(prev => ({
      ...prev,
      walletRows: [...prev.walletRows, {
        id: String(prev.walletRows.length + 1),
        privateKey: '',
        address: '',
        solBalance: '-',
        estVolume: '-',
        buyAmount: ''
      }]
    }));
  }
};

export const removeWalletRow = (id: string, setFormData: React.Dispatch<React.SetStateAction<FormData>>) => {
  setFormData(prev => ({
    ...prev,
    walletRows: prev.walletRows.filter(row => row.id !== id)
  }));
}; 