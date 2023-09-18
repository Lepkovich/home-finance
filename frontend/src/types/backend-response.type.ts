
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

export type GetCategoryExpenseType = {
    id: number,
    title: string
}

export type GetOperationsPeriodType = {
        id: number,
        type: string,
        amount: number,
        date: string,
        comment: string,
        category: string
}

export type PostIncomeCategoryType = {
    id: number,
    title: string
}
export type PostExpenseCategoryType = {
    id: number,
    title: string
}