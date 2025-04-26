import { ChangePassword } from 'services/security/endpoints/UserService';
import { ToastError, ToastSuccess } from 'components/Messages/Toast';
import { ErrorHandler, GetUser, Logout } from 'constants/Global';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Password } from 'primereact/password';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';

interface IValidations {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    noConsecutive: boolean;
}

interface IPasswordData {
    currentPassword: string;
    NewPassword: string;
}

const Security: React.FC = () => {
    const { t } = useTranslation('changePassword');
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState<string>('');
    const [originalPassword, setOriginalPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [validations, setValidations] = useState<IValidations>({
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
        noConsecutive: false
    });

    const ValidatePassword = (password: string): void => {
        const validations: IValidations = {
            minLength: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            noConsecutive: !/(0123|1234|2345|3456|4567|5678|6789|7890)/.test(password)
        };
        setValidations(validations);
    };

    const HandleUpdatePassword = async (): Promise<void> => {
        const user = GetUser();
        if (!user) {
            ToastError(t('userNotFound'));
            return;
        }
        const userId = user.idUser;
        if (newPassword === confirmNewPassword) {
            if (Object.values(validations).every(Boolean)) {
                const data: IPasswordData = {
                    currentPassword: originalPassword,
                    NewPassword: newPassword
                };
                try {
                    await ChangePassword(userId, data);
                    Logout();
                    navigate('/login');
                    ToastSuccess(t('passwordUpdated'));
                } catch (error) {
                    ToastError(await ErrorHandler(error));
                }
            } else {
                ToastError(t('checkRequirements'));
            }
        } else {
            ToastError(t('passwordMismatch'));
        }
    };

    useEffect(() => {
        ValidatePassword(newPassword);
    }, [newPassword]);

    const cardStyle = {
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        height: '100%',
        transition: 'all 0.3s ease'
    };

    const iconContainerStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff0e6',
        fontSize: '20px',
        marginBottom: '0'
    };

    return (
        <div className="grid">
            <div className="col-12 mb-4">
                <h1 className="text-3xl font-bold text-primary diligentec-text-orange">{t('title')}</h1>
                <p style={{ fontSize: '1.1rem', color: '#666666' }}>{t('description')}</p>
            </div>
            
            {/* Columna izquierda - Campos de contraseña */}
            <div className="col-12 md:col-6 mb-4">
                <div 
                    className="card h-full"
                    style={cardStyle}
                >
                    <div className="flex align-items-center mb-4">
                        <div style={iconContainerStyle}>
                            <i className="pi pi-lock" style={{ color: '#f27935', fontSize: '1.5rem' }}></i>
                        </div>
                        <h2 className="text-xl font-semibold ml-3 my-0 flex align-items-center">{t('title')}</h2>
                    </div>
                    
                    <div className="flex flex-column gap-4 mt-4">
                        <div className="field">
                            <span className="p-float-label w-full">
                                <Password 
                                    id="oldPassword" 
                                    toggleMask 
                                    required 
                                    feedback={false} 
                                    value={originalPassword} 
                                    onChange={(e) => setOriginalPassword(e.target.value)} 
                                    className="w-full"
                                    inputClassName="w-full"
                                    pt={{
                                        input: { className: 'w-full' },
                                        showIcon: { className: 'flex align-items-center justify-content-center' },
                                        hideIcon: { className: 'flex align-items-center justify-content-center' }
                                    }}
                                />
                                <label htmlFor="oldPassword">{t('currentPassword')}</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label w-full">
                                <Password 
                                    id="newPassword" 
                                    toggleMask 
                                    required 
                                    feedback={false} 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    className="w-full"
                                    inputClassName="w-full"
                                    pt={{
                                        input: { className: 'w-full' },
                                        showIcon: { className: 'flex align-items-center justify-content-center' },
                                        hideIcon: { className: 'flex align-items-center justify-content-center' }
                                    }}
                                />
                                <label htmlFor="newPassword">{t('newPassword')}</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label w-full">
                                <Password 
                                    id="confirmPassword" 
                                    toggleMask 
                                    required 
                                    feedback={false} 
                                    value={confirmNewPassword} 
                                    onChange={(e) => setConfirmNewPassword(e.target.value)} 
                                    className="w-full"
                                    inputClassName="w-full"
                                    pt={{
                                        input: { className: 'w-full' },
                                        showIcon: { className: 'flex align-items-center justify-content-center' },
                                        hideIcon: { className: 'flex align-items-center justify-content-center' }
                                    }}
                                />
                                <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
                            </span>
                        </div>
                        <div className="flex align-items-center justify-content-end gap-2 mt-4">
                            <Button
                                label={t('clear')}
                                icon="pi pi-times"
                                severity="danger"
                                outlined
                                onClick={() => {
                                    setOriginalPassword('');
                                    setNewPassword('');
                                    setConfirmNewPassword('');
                                }}
                            />
                            <Button 
                                label={t('save')} 
                                icon="pi pi-save"
                                style={{backgroundColor: "#154270", borderColor: "#154270"}}
                                onClick={HandleUpdatePassword}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Columna derecha - Instrucciones */}
            <div className="col-12 md:col-6 mb-4">
                <div 
                    className="card h-full"
                    style={cardStyle}
                >
                    <div className="flex align-items-center mb-4">
                        <div style={iconContainerStyle}>
                            <i className="pi pi-info-circle" style={{ color: '#f27935', fontSize: '1.5rem' }}></i>
                        </div>
                        <h2 className="text-xl font-semibold ml-3 my-0 flex align-items-center">{t('requirementsTitle')}</h2>
                    </div>
                    
                    <div className="user-card-name mt-4">
                        <ul className="list-none p-0 m-0">
                            {[
                                { text: t('minLength'), valid: validations.minLength },
                                { text: t('uppercase'), valid: validations.uppercase },
                                { text: t('lowercase'), valid: validations.lowercase },
                                { text: t('number'), valid: validations.number }
                            ].map((item, index) => (
                                <li key={index} className="flex align-items-center justify-content-between py-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <span className="text-900">{item.text}</span>
                                    {item.valid ? 
                                        <i className="pi pi-check text-green-500"></i> : 
                                        <i className="pi pi-times text-red-500"></i>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Security;