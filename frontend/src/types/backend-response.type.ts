export type RefreshResponseType = {
    error: boolean,
    message: string,
    tokens: {
        accessToken?: string,
        refreshToken?: string,
    }
}

export type GetErrorResponseType = {
    error?: boolean,
    message: string,
}

export type GetCategoryIncomeType = {
    id: number,
    title: string
}