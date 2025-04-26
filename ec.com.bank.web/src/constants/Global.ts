import { DecryptData } from "utilities/CryptoUtils";

interface UserAccessLog {
    idUserAccessLog: number;
    userId: number;
    applicationId: number;
    ip: string;
    origin: string;
    loginDate: string;
    userFirstName: string;
    userLastName: string;
    createdBy: string;
}

interface User {
    idUser: number;
    nickname: string;
    identification: string;
    firstNames: string;
    lastNames: string;
    username: string;
    phone: string;
    email: string;
    enabledTwoFA: boolean;
    notifyLogin: boolean;
    isSystemUser: boolean;
    imageDisplayId: string;
    status: string;
    userAccessLogs: UserAccessLog[];
}

interface TokenData {
    token: string;
    expiry: number;
}

interface ApiError {
    response?: {
        data?: {
            Message?: string;
            Data?: string[] | string;
            message?: string;
        };
    };
    request?: unknown;
    message?: string;
}

export function GetMenu(): string | null {
    // Menú quemado para maquetado
    const menuMockup = [
        {
            "menuUserItem": {
                "name": "Home",
                "description": "Pantalla Home",
                "icon": "pi pi-home",
                "order": 1,
                "privileges": [],
                "children": [
                    {
                        "name": "Inicio",
                        "description": "Inicio",
                        "icon": "pi pi-home",
                        "url": "/home",
                        "order": 1,
                        "privileges": [],
                        "children": [
                            {
                                "name": "Dashboard",
                                "description": "Dashboard",
                                "icon": "pi pi-home",
                                "url": "/home",
                                "order": 1,
                            },
                            {
                                "name": "Virtual Assistant",
                                "description": "Asistente Virtual",
                                "icon": "pi pi-comments",
                                "url": "/virtual-assistant",
                                "order": 2,
                            }
                        ]
                    },
                ]
            }
        }
    ];
    
    return JSON.stringify(menuMockup);
}

export const getCredentials = () => {
    const credentialsStr = localStorage.getItem('credentials');
    return credentialsStr ? JSON.parse(credentialsStr) : null;
};

export const Logout = (): void => {
    localStorage.clear();
    sessionStorage.clear();
};

export function GetUser(): User | null {
    try {
        const itemStr = localStorage.getItem('user');
        if (!itemStr) {
            // Datos dummy para desarrollo
            return {
                idUser: 0,
                nickname: "Usuario Demo",
                identification: "0000000000",
                firstNames: "Usuario",
                lastNames: "Demo",
                username: "usuario.demo",
                phone: "0000000000",
                email: "admin@bancoguayaquil.com",
                enabledTwoFA: false,
                notifyLogin: false,
                isSystemUser: false,
                imageDisplayId: "",
                status: "ACTIVE",
                userAccessLogs: []
            };
        }
        return JSON.parse(itemStr) as User;
    }
    catch {
        // Si hay algún error, también devolver datos dummy
        return {
            idUser: 0,
            nickname: "Usuario Demo",
            identification: "0000000000",
            firstNames: "Usuario",
            lastNames: "Demo",
            username: "usuario.demo",
            phone: "0000000000",
            email: "admin@bancoguayaquil.com",
            enabledTwoFA: false,
            notifyLogin: false,
            isSystemUser: false,
            imageDisplayId: "",
            status: "ACTIVE",
            userAccessLogs: []
        };
    }
}

export function GetToken(): string | null {
    
    const item = localStorage.getItem('token');
    if (!item) {
        return null;
    }
    const now = new Date();
    let items: TokenData;
    try {
        const decryptedData = DecryptData(item);
        if (!decryptedData) {
            throw new Error('Decryption failed');
        }
        items = decryptedData as unknown as TokenData;
    } catch {
        try {
            items = JSON.parse(item) as TokenData;
        } catch {
            return null;
        }
    }

    if (now.getTime() > items.expiry) {
        return null;
    }
    return items.token;
}

export const ErrorHandler = async (error: ApiError): Promise<string> => {
    let messages = '';
    if (error.response) {
        if (error.response.data) {
            if (error.response.data.Message) {
                messages = error.response.data.Message;

                if (error.response.data.Data && Array.isArray(error.response.data.Data)) {
                    messages += '\n' + error.response.data.Data.map((msg: string, index: number) =>
                        `${index + 1}. ${msg}`).join('\n');
                }
            } else {
                if (error.response.data.Data && Array.isArray(error.response.data.Data)) {
                    messages = error.response.data.Data.map((msg: string, index: number) =>
                        `${index + 1}. ${msg}`).join('\n');
                } else {
                    messages = error.response.data.Data || error.response.data.message || 'Error en la respuesta del servidor';
                }
            }
        } else {
            messages = 'Error en la respuesta del servidor sin datos';
        }
    } else if (error.request) {
        messages = 'No hay respuesta del servidor';
    } else {
        messages = error.message ?? 'Error desconocido';
    }
    return messages;
};