import EmptyPhoto from 'styles/images/ProfileEmpty.jpg';
import { ToastError } from 'components/Messages/Toast';
import React, { useState, ChangeEvent } from 'react';
import { Avatar } from 'primereact/avatar';

interface AvatarUploaderProps {
  profileImage: string;
  setProfileImage: (image: string) => void;
  setFileBase64: (base64: string) => void;
  setFileName: (name: string) => void;
  disabled: boolean;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ 
  profileImage, 
  setProfileImage, 
  setFileBase64, 
  setFileName, 
  disabled 
}) => {
    const [localProfileImage, setLocalProfileImage] = useState<string>(profileImage);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    const base64 = (e.target.result as string).split(',')[1];
                    setFileBase64(base64);
                    setFileName(file.name);
                    setProfileImage(e.target.result as string);
                    setLocalProfileImage(e.target.result as string);
                } else {
                    console.error("e.target.result es null o undefined");
                }
            };
            reader.onerror = (error: ProgressEvent<FileReader>) => {
                ToastError(`Error al leer el archivo: ${error.target?.error?.message || 'Error desconocido'}`);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <Avatar 
                shape="circle" 
                image={localProfileImage || EmptyPhoto} 
                style={{ width: '250px', height: '250px', border: '4px solid #154270' }} 
            />
            <input 
                type="file" 
                accept="image/*"
                aria-label="Subir imagen de avatar"
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
                id="file-input" 
            />
            <button
                aria-label="Subir avatar"
                style={{
                    position: 'absolute',
                    bottom: '0px',
                    left: '75%',
                    width: '40px',
                    height: '40px',
                    transform: 'translateX(-50%)',
                    background: '#154270',
                    color: 'white',
                    borderRadius: '100%',
                    border: 'none',
                    cursor: 'pointer'
                }}
                disabled={disabled}
                onClick={() => document.getElementById('file-input')?.click()}
            >
                <i className="pi pi-camera" style={{ fontSize: '1.7em' }}></i>
            </button>
        </div>
    );
};

export default AvatarUploader;