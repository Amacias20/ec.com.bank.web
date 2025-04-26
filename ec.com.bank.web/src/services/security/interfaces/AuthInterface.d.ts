export interface AuthenticationResponse {
    code: number;
    message: string;
    data: {
        token: string;
        tokenDate: string;
        authenticate: boolean;
        twoFactorRequired: boolean;
        forceChangePasswordRequired: boolean;
        checksum: string;
        usuario: {
            idUser: number;
            identification: string;
            firstNames: string;
            // lastNames: string;
            nickname: string;
            // phone: string;
            email: string;
            // enabledTwoFA: boolean;
            // notifyLogin: boolean;
            // isSystemUser: boolean;
             imageDisplayId: string;
            // status: string;
            // userAccessLogs: any[];
        };
    };
}

export interface AuthByIdResponse {
    token: string;
    refreshToken: string;
    expiresIn: number;
    userInfo?: {
        id: number;
        email?: string;
        userName?: string;
        email: string;
    };
}

export interface PasswordChangeResponse {
    success: boolean;
    message: string;
}

export interface RecoveryPasswordResponse {
    code: number;
    message: string;
    data: {
        codeSend: boolean;
        name: string;
        email: string;
    };
}

export interface ValidateRecoveryCodeResponse {
    code: number;
    message: string;
    data: {
        isValid: boolean;
    };
}

export interface PasswordChangeBody {
    email?: string;
    temporalPassword: string;
    newPassword: string;
}

export interface RecoveryPasswordBody {
    email?: string;
}

export interface ResetPasswordBody {
    email?: string;
    code: string;
    newPassword: string;
}

export interface ForcedChangePasswordBody {
    email?: string;
    temporalPassword?: string;
    // code: string;
    newPassword: string;
}

export interface ValidateRecoveryCodeBody {
    email?: string;
    userName?: string;
    code: string;
}