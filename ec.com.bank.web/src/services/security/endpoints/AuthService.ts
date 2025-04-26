import { AuthenticationResponse, AuthByIdResponse, PasswordChangeResponse, RecoveryPasswordResponse, ValidateRecoveryCodeResponse, PasswordChangeBody, RecoveryPasswordBody, ValidateRecoveryCodeBody, ResetPasswordBody, ForcedChangePasswordBody } from 'services/security/interfaces/AuthInterface';
import { APP_CODE, SecurityPathBuilder, SecurityPathsEnum } from 'services/Paths';
import axios from 'axios';

export const PostAuthentication = async (email: string, passWord: string, codeTwoFactorAuthenticator?: string): Promise<AuthenticationResponse> => {
    const ruta = SecurityPathBuilder(SecurityPathsEnum.Auth);
    const body: {
        email: string;
        password: string;
        codeApplication: string;
        includeUserInfo: boolean;
        codeTwoFactorAuthenticator?: string;
    } = {
        email: email,
        password: passWord,
        codeApplication: APP_CODE,
        includeUserInfo: true
    };

    if (codeTwoFactorAuthenticator) {
        body.codeTwoFactorAuthenticator = codeTwoFactorAuthenticator;
    }

    const { data } = await axios.post<AuthenticationResponse>(`${ruta}`, body);
    return data;
};

export const PostAuthById = async (iD: string, passWord: string): Promise<AuthByIdResponse | string> => {
    try {
        const { data } = await axios.post<AuthByIdResponse>(`${SecurityPathBuilder(SecurityPathsEnum.AuthById)}`, {
            identification: iD,
            password: passWord,
            aplicacionId: 1,
            includeUserInfo: true
        });
        return data;
    } catch (error: any) {
        if (error.response) {
            return `Error en la respuesta de la API: ${error.response.status} - ${error.response.data}`;
        } else if (error.request) {
            return 'Error en la solicitud a la API: No se recibió respuesta.';
        } else {
            return `Error general: ${error.message}`;
        }
    }
};

export const PostForceChangePassword = async (body: PasswordChangeBody): Promise<PasswordChangeResponse> => {
    const ruta = SecurityPathBuilder(SecurityPathsEnum.Auth);
    const bodyResponse = {
        email: body.email,
        temporalPassword: body.temporalPassword,
        newPassword: body.newPassword,
        codeApplication: APP_CODE
    };
    try {
        const { data } = await axios.post<{ code: number; message: string; data: PasswordChangeResponse }>(`${ruta}/force_change_password`, bodyResponse);
        if (data.code === 200 && data.message === "Solicitud procesada con éxito") {
            return data.data;
        } else {
            throw new Error("Se ha producido un error al procesar la solicitud");
        }    
    } catch (error: any) {
        throw new Error(error.message || "Error al cambiar la contraseña");
    }
};

export const PostRecoveryPassword = async (body: RecoveryPasswordBody): Promise<RecoveryPasswordResponse> => {
    const ruta = SecurityPathBuilder(SecurityPathsEnum.Auth);
    const bodyResponse = {
        email: body.email,
        codeApplication: APP_CODE
    }
    try {
        const { data } = await axios.post<RecoveryPasswordResponse>(`${ruta}/recovery_password`, bodyResponse);
        if (data.code === 200 && data.message === "Solicitud procesada con éxito") {
            return data;
        } else {
            throw new Error("Se ha producido un error al procesar la solicitud");
        }    
    } catch (error: any) {
        throw new Error(error.message || "Error al obtener la recuperación de contraseña");
    }
}

export const PostResetPassword = async (body: ResetPasswordBody): Promise<PasswordChangeResponse> => {
    const ruta = SecurityPathBuilder(SecurityPathsEnum.Auth);
    const bodyResponse = {
        email: body.email,
        code: body.code,
        newPassword: body.newPassword,
        codeApplication: APP_CODE
    };
    try {
        const { data } = await axios.post<{ code: number; message: string; data: PasswordChangeResponse }>(`${ruta}/reset_password`, bodyResponse);
        if (data.code === 200 && data.message === "Solicitud procesada con éxito") {
            return data.data;
        } else {
            throw new Error("Se ha producido un error al procesar la solicitud");
        }    
    } catch (error: any) {
        throw new Error(error.message || "Error al cambiar la contraseña");
    }
};

export const PostForcedChangePassword = async (body: ForcedChangePasswordBody): Promise<PasswordChangeResponse> => {
    const ruta = SecurityPathBuilder(SecurityPathsEnum.Auth);
    const bodyResponse = {
        email: body.email,
        temporalPassword: body.temporalPassword,
        newPassword: body.newPassword,
        codeApplication: APP_CODE
    };
    try {
        const { data } = await axios.post<{ code: number; message: string; data: PasswordChangeResponse }>(`${ruta}/force_change_password`, bodyResponse);
        if (data.code === 200 && data.message === "Solicitud procesada con éxito") {
            return data.data;
        } else {
            throw new Error("Se ha producido un error al procesar la solicitud");
        }    
    } catch (error: any) {
        throw new Error(error.message || "Error al cambiar la contraseña");
    }
};

export const PostValidateRecoveryCode = async (body: ValidateRecoveryCodeBody): Promise<ValidateRecoveryCodeResponse> => {
    
    const ruta = SecurityPathBuilder(SecurityPathsEnum.Auth);
    const bodyResponse = {
        email: body.email,
        code: body.code,
        codeApplication: APP_CODE
    };

    try {
        const { data } = await axios.post<ValidateRecoveryCodeResponse>(`${ruta}/validate_recovery_code`, bodyResponse,{
            validateStatus: (status) => status < 999 // no lances error para 4xx
          });
        if (data.code === 200 && data.message === "Solicitud procesada con éxito") {
            return data;
        } else {
            throw new Error(data.message || "Se ha producido un error al procesar la solicitud");
        }    
    } catch (error: any) {
        throw new Error(error.message || "Error al validar el código de recuperación");
    }
};