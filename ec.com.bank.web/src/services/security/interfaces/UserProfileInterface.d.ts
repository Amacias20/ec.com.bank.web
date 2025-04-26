export interface PostUserProfileBody {
    userId: number;
    darkMode: boolean;
    menuMode: string;
    layoutScale: number;
    menuTheme: string;
    topbarTheme: string;
    componentTheme: string;
    lang: string;
}

export interface PatchUserProfileBody {
    lang: string;
}

export interface GetUserProfileAuditParams {
    TransactionId?: number;
    Type?: string;
    IncludeDetail?: boolean;
    action?: string;
}

export interface UserAuditResponse {
    idAuditLog: number;
    transactionId: number;
    type: string;
    action: string;
    value: string;
}

export interface UserAuditListResponse {
    data: {
        pageSize: number;
        currentPage: number;
        totalPages: number;
        totalItems: number;
        data: UserAuditResponse[];
    }
}