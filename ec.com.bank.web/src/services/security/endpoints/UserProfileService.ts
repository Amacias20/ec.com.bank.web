import { GetUserProfileAuditParams, PatchUserProfileBody, PostUserProfileBody, UserAuditListResponse } from 'services/security/interfaces/UserProfileInterface';
import { SecurityPathBuilder, SecurityPathsEnum, BuildUrlParams } from 'services/Paths';
import api from 'services/Interceptor';

export const GetUserProfile = async (id: number): Promise<any> => {
    const url = `${SecurityPathBuilder(SecurityPathsEnum.UserProfile)}/${id}`;

    const { data } = await api.get(url);
    return data;
};

export const PostUserProfile = async (body: PostUserProfileBody): Promise<any> => {
    const url = SecurityPathBuilder(SecurityPathsEnum.UserProfile);
    const { data } = await api.post(`${url}`, body);
    return data;
};

export const ChangeUserLanguage = async (id: number, body: PatchUserProfileBody): Promise<any> => {
    const url = `${SecurityPathBuilder(SecurityPathsEnum.UserProfile)}/${id}/lang`;
    const { data } = await api.patch(`${url}`, body);
    return data;
};

export const DeleteUser = async (userId: number): Promise<any> => {
    const url = `${SecurityPathBuilder(SecurityPathsEnum.UserProfile)}/${userId}`;
    const response = await api.delete(url);
    return response.data;
};

export const GetUserProfileAudit = async (params: GetUserProfileAuditParams = {}): Promise<UserAuditListResponse> => {
    let url = `${SecurityPathBuilder(SecurityPathsEnum.UserProfile)}/audit`;

    const urlParams = BuildUrlParams(params as Record<string, string | string[] | undefined>);
    if (urlParams) {
        url += `?${urlParams}`;
    }

    const { data } = await api.get(url);
    return data;
};