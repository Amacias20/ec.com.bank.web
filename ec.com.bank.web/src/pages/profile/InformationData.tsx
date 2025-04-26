import { UpdateUser, GetUserById } from 'services/security/endpoints/UserService';
import { ToastError, ToastSuccess } from 'components/Messages/Toast';
import { GetRol } from 'services/security/endpoints/RolService';
import { GetUser, ErrorHandler } from 'constants/Global';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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

const InformationData: React.FC = () => {
    const { t } = useTranslation('myProfile');
    const user = GetUser();
    const [editing, setEditing] = useState(false);
    const [userRoles, setUserRoles] = useState<any[]>([]);

    const formik = useFormik({
        initialValues: {
            identification: user.identification || '',
            firstNames: user.firstNames || '',
            lastNames: user.lastNames || '',
            nickname: user.nickname || '',
            phone: user.phone || '',
            email: user.email || '',
            enabledTwoFA: user.enabledTwoFA || false,
            notifyLogin: user.notifyLogin || false
        },
        validationSchema: Yup.object({
            identification: Yup.string().required(t('identificationRequired')),
            firstNames: Yup.string().required(t('firstNameRequired')),
            lastNames: Yup.string().required(t('lastNameRequired')),
            nickname: Yup.string().required(t('nicknameRequired')),
            phone: Yup.string().required(t('phoneRequired')),
            email: Yup.string().email(t('emailInvalid')).required(t('emailRequired'))
        }),
        onSubmit: async (values) => {
            try {
                const updateBody = {
                    identification: values.identification,
                    firstNames: values.firstNames,
                    lastNames: values.lastNames,
                    nickname: values.nickname,
                    phone: values.phone,
                    enabledTwoFA: values.enabledTwoFA,
                    notifyLogin: values.notifyLogin
                };
                await UpdateUser(user.idUser, updateBody);
                
                // Actualizar el localStorage con los nuevos valores
                const updatedUser = {
                    ...user,
                    identification: values.identification,
                    firstNames: values.firstNames,
                    lastNames: values.lastNames,
                    nickname: values.nickname,
                    phone: values.phone,
                    enabledTwoFA: values.enabledTwoFA,
                    notifyLogin: values.notifyLogin
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                ToastSuccess(t('successUpdate'));
                setEditing(false);
            } catch (error) {
                ToastError(await ErrorHandler(error));
            }
        }
    });

    const fetchUserRoles = async () => {
        try {
            const response = await GetUserById(user.idUser, { includeApplicationRoles: true, IncludeApplications: true });
            if (response.data.userApplicationRoles && response.data.userApplicationRoles.length > 0) {
                // Filtrar solo los roles ACTIVOS
                const activeUserRoles = response.data.userApplicationRoles.filter(role => role.status === "ACTIVO");
                
                // Obtener IDs únicos de aplicaciones de roles activos
                const appIds = [...new Set(activeUserRoles.map(item => item.applicationId))];
                
                // Obtener IDs de roles asignados
                const assignedRoleIds = activeUserRoles.map(item => item.roleId);
                
                if (appIds.length > 0) {
                    try {
                        // Obtener todos los roles de las aplicaciones
                        const rolResponse = await GetRol({
                            applicationId: appIds,
                            status: 'ACTIVO',
                            includeApplication: true
                        });
                        
                        const allRoles = Array.isArray(rolResponse.data.data)
                            ? rolResponse.data.data
                            : Array.isArray(rolResponse.data)
                                ? rolResponse.data
                                : [];
                        
                        // Filtrar solo los roles asignados al usuario
                        const userAssignedRoles = allRoles.filter(role => assignedRoleIds.includes(role.idRole));
                        setUserRoles(userAssignedRoles);
                    } catch (error) {
                        ToastError(await ErrorHandler(error));
                        setUserRoles([]);
                    }
                }
            }
        } catch (error) {
            ToastError(await ErrorHandler(error));
        }
    };
    
    useEffect(() => {
        fetchUserRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="grid">
            <div className="col-12 mb-4">
                <div className="flex justify-content-between align-items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-primary diligentec-text-orange">{t('personalInfo')}</h1>
                        <p style={{ fontSize: '1.1rem', color: '#666666' }}>{t('personalInfoDescription')}</p>
                    </div>
                </div>
            </div>

            <div className="col-12 lg:col-6 mb-4">
                <div
                    className="card h-full"
                    style={cardStyle}
                >
                    <div className="flex align-items-center mb-4 justify-content-between flex-wrap">
                        <div className="flex align-items-center mb-2 md:mb-0">
                            <div style={iconContainerStyle}>
                                <i className="pi pi-user" style={{ color: '#f27935', fontSize: '1.5rem' }}></i>
                            </div>
                            <h2 className="text-xl font-semibold ml-3 my-0 flex align-items-center">{t('personalInfo')}</h2>
                        </div>
                        <div className="flex align-items-center">
                            <Button 
                                icon={editing ? "pi pi-save" : "pi pi-pencil"} 
                                label={editing ? t('save') : t('edit')} 
                                className="p-button-rounded p-button-outlined"
                                onClick={editing ? formik.handleSubmit : () => setEditing(true)}
                        />
                        {editing && <Button 
                            icon="pi pi-times" 
                            label={t('cancel')}
                            style={{ marginLeft: '10px',  }}
                            severity="danger"
                            className="p-button-rounded p-button-outlined"
                                onClick={() => setEditing(false)}
                            />}
                        </div>
                    </div>

                    <div className="user-card-name mt-4">
                        {editing ? (
                            // Modo edición con labels a la izquierda y campos a la derecha
                            <>
                                <div className="field mb-3">
                                    <div className="flex align-items-start flex-column sm:flex-row">
                                        <label htmlFor="identification" className="block text-900 font-medium w-full sm:w-4 mb-2 sm:mb-0">{t('identification')}:</label>
                                        <div className="w-full sm:w-8">
                                            <InputText 
                                                id="identification" 
                                                name="identification" 
                                                value={formik.values.identification} 
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={formik.errors.identification && formik.touched.identification ? 'p-invalid w-full' : 'w-full'}
                                                keyfilter="num"
                                                maxLength={10}
                                            />
                                            {formik.errors.identification && formik.touched.identification && 
                                                <small className="p-error">{formik.errors.identification}</small>}
                                        </div>
                                    </div>
                                </div>
                                <div className="field mb-3">
                                    <div className="flex align-items-start flex-column sm:flex-row">
                                        <label htmlFor="nickname" className="block text-900 font-medium w-full sm:w-4 mb-2 sm:mb-0">{t('nickname')}:</label>
                                        <div className="w-full sm:w-8">
                                            <InputText 
                                                id="nickname" 
                                                name="nickname" 
                                                value={formik.values.nickname} 
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={formik.errors.nickname && formik.touched.nickname ? 'p-invalid w-full' : 'w-full'}
                                            />
                                            {formik.errors.nickname && formik.touched.nickname && 
                                                <small className="p-error">{formik.errors.nickname}</small>}
                                        </div>
                                    </div>
                                </div>
                                <div className="field mb-3">
                                    <div className="flex align-items-start flex-column sm:flex-row">
                                        <label htmlFor="firstNames" className="block text-900 font-medium w-full sm:w-4 mb-2 sm:mb-0">{t('firstName')}:</label>
                                        <div className="w-full sm:w-8">
                                            <InputText 
                                                id="firstNames" 
                                                name="firstNames" 
                                                value={formik.values.firstNames} 
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={formik.errors.firstNames && formik.touched.firstNames ? 'p-invalid w-full' : 'w-full'}
                                            />
                                            {formik.errors.firstNames && formik.touched.firstNames && 
                                                <small className="p-error">{formik.errors.firstNames}</small>}
                                        </div>
                                    </div>
                                </div>
                                <div className="field mb-3">
                                    <div className="flex align-items-start flex-column sm:flex-row">
                                        <label htmlFor="lastNames" className="block text-900 font-medium w-full sm:w-4 mb-2 sm:mb-0">{t('lastName')}:</label>
                                        <div className="w-full sm:w-8">
                                            <InputText 
                                                id="lastNames" 
                                                name="lastNames" 
                                                value={formik.values.lastNames} 
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={formik.errors.lastNames && formik.touched.lastNames ? 'p-invalid w-full' : 'w-full'}
                                            />
                                            {formik.errors.lastNames && formik.touched.lastNames && 
                                                <small className="p-error">{formik.errors.lastNames}</small>}
                                        </div>
                                    </div>
                                </div>
                                <div className="field mb-3">
                                    <div className="flex align-items-start flex-column sm:flex-row">
                                        <label htmlFor="phone" className="block text-900 font-medium w-full sm:w-4 mb-2 sm:mb-0">{t('phone')}:</label>
                                        <div className="w-full sm:w-8">
                                            <InputText 
                                                id="phone" 
                                                name="phone" 
                                                value={formik.values.phone} 
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={formik.errors.phone && formik.touched.phone ? 'p-invalid w-full' : 'w-full'}
                                                keyfilter="num"
                                                maxLength={10}
                                            />
                                            {formik.errors.phone && formik.touched.phone && 
                                                <small className="p-error">{formik.errors.phone}</small>}
                                        </div>
                                    </div>
                                </div>
                                <div className="field mb-3">
                                    <div className="flex align-items-start flex-column sm:flex-row">
                                        <label htmlFor="email" className="block text-900 font-medium w-full sm:w-4 mb-2 sm:mb-0">{t('email')}:</label>
                                        <div className="w-full sm:w-8">
                                            <InputText 
                                                id="email" 
                                                name="email" 
                                                value={formik.values.email} 
                                                disabled={true}
                                                className="w-full opacity-70"
                                            />
                                            <small className="text-500">{t('emailCannotBeChanged')}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="field mb-3">
                                    <div className="flex align-items-start flex-column sm:flex-row justify-content-between">
                                        <label htmlFor="enabledTwoFA" className="block text-900 font-medium w-full sm:w-4 mb-2 sm:mb-0">{t('twoFactorAuth')}:</label>
                                        <div className="w-full sm:w-8">
                                            <div className="flex align-items-center">
                                                <InputSwitch 
                                                    id="enabledTwoFA"
                                                    name="enabledTwoFA"
                                                    checked={formik.values.enabledTwoFA}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="field mb-3">
                                    <div className="flex align-items-start flex-column sm:flex-row justify-content-between">
                                        <label htmlFor="notifyLogin" className="block text-900 font-medium w-full sm:w-4 mb-2 sm:mb-0">{t('loginNotification')}:</label>
                                        <div className="w-full sm:w-8">
                                            <div className="flex align-items-center">
                                                <InputSwitch 
                                                    id="notifyLogin"
                                                    name="notifyLogin"
                                                    checked={formik.values.notifyLogin}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Modo visualización
                            <>
                                <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center py-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <span className="text-900 font-medium mb-2 sm:mb-0">{t('identification')}:</span>
                                    <span className="text-700">{user.identification || t('noRecord')}</span>
                                </div>
                                <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center py-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <span className="text-900 font-medium mb-2 sm:mb-0">{t('nickname')}:</span>
                                    <span className="text-700">{user.nickname || t('noRecord')}</span>
                                </div>
                                <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center py-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <span className="text-900 font-medium mb-2 sm:mb-0">{t('firstName')}:</span>
                                    <span className="text-700">{user.firstNames || t('noRecord')}</span>
                                </div>
                                <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center py-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <span className="text-900 font-medium mb-2 sm:mb-0">{t('lastName')}:</span>
                                    <span className="text-700">{user.lastNames || t('noRecord')}</span>
                                </div>
                                <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center py-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <span className="text-900 font-medium mb-2 sm:mb-0">{t('phone')}:</span>
                                    <span className="text-700">{user.phone || t('noRecord')}</span>
                                </div>
                                <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center py-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <span className="text-900 font-medium mb-2 sm:mb-0">{t('email')}:</span>
                                    <span className="text-700">{user.email || t('noRecord')}</span>
                                </div>
                                <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center py-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <span className="text-900 font-medium mb-2 sm:mb-0">{t('twoFactorAuth')}:</span>
                                    <span className="text-700">{user.enabledTwoFA ? t('enabled') : t('disabled')}</span>
                                </div>
                                <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center py-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <span className="text-900 font-medium mb-2 sm:mb-0">{t('loginNotification')}:</span>
                                    <span className="text-700">{user.notifyLogin ? t('enabled') : t('disabled')}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-12 lg:col-6 mb-4">
                <div
                    className="card h-full"
                    style={cardStyle}
                >
                    <div className="flex align-items-center mb-4">
                        <div style={iconContainerStyle}>
                            <i className="pi pi-user" style={{ color: '#f27935', fontSize: '1.5rem' }}></i>
                        </div>
                        <h2 className="text-xl font-semibold ml-3 my-0 flex align-items-center">{t('roleInfo')}</h2>
                    </div>

                    <div className="user-card-name mt-4">
                        <div>
                            {userRoles.length > 0 ? (
                                (() => {
                                    // Agrupar roles por aplicación
                                    const rolesByApp = userRoles.reduce((acc, role) => {
                                        const appName = role.applicationName || t('application');
                                        if (!acc[appName]) {
                                            acc[appName] = [];
                                        }
                                        acc[appName].push(role.name);
                                        return acc;
                                    }, {});
                                    
                                    // Mostrar roles agrupados por aplicación
                                    return Object.entries(rolesByApp).map(([appName, roles], index) => (
                                        <div key={index} className="mb-4">
                                            <div className="flex align-items-center mb-2">
                                                <i className="pi pi-shield mr-2 text-primary" style={{ fontSize: '1.2rem' }}></i>
                                                <span className="text-900 font-semibold text-lg">{appName}:</span>
                                            </div>
                                            <ul className="list-none pl-4 m-0">
                                                {Array.isArray(roles) && roles.map((roleName, roleIndex) => (
                                                    <li key={roleIndex} className="flex align-items-center py-2">
                                                        <i className="pi pi-check-circle mr-2" style={{ color: '#4caf50' }}></i>
                                                        <span className="text-700">{roleName}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {index < Object.entries(rolesByApp).length - 1 && (
                                                <div className="my-3 border-bottom-1 border-300"></div>
                                            )}
                                        </div>
                                    ));
                                })()
                            ) : (
                                <div className="flex justify-content-center align-items-center p-5">
                                    <div className="text-center">
                                        <i className="pi pi-shield text-4xl mb-3" style={{ color: '#e0e0e0' }}></i>
                                        <p className="text-600 font-medium">{t('noRolesAssigned')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    );
};

export default InformationData;