export interface SignupData {
    firstname: string;
    lastname?: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface ShortenData {
    url: string;
    code?: string;
}

export interface VerificationCodeData {
    email: string;
    providedCode: number;
}

export interface ChangePasswordData {
    oldPassword: string;
    newPassword: string;
}

export interface ForgotPasswordData {
    email: string;
    providedCode: number;
    newPassword: string;
}

export interface ChangeNameData {
    firstname: string;
    lastname?: string;
}

export interface Url {
    id: string;
    shortCode: string;
    targetURL: string;
    createdAt: string;
}

export interface AnalyticsData {
    analytics: {
        totalClicks: number;
        byDevice: Array<{ deviceType: string; count: number }>;
        byBrowser: Array<{ browser: string; count: number }>;
        byCountry: Array<{ country: string; count: number }>;
        dailyStats: Array<{ date: string; count: number }>;
    };
    url: {
        id: string;
        shortCode: string;
        targetURL: string;
    };
}