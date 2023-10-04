
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
    message: string
}

export type PostSignupResponseType = {
    error?: boolean,
    message?: string,
    user?: {
    id: number,
    email: string,
    name: string,
    lastName: string
    }
}

export type PostLoginResponseType = {
    error?: boolean,
    message?: string
    tokens?: {
        accessToken: string,
        refreshToken: string,
    }
    user?: {
        name: string,
        lastName: string,
        id: number
    }
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
        category: string, 
        [key: string]: string | number
}

export type PostIncomeCategoryType = {
    id: number,
    title: string
}
export type PostExpenseCategoryType = {
    id: number,
    title: string
}

export type PostOperationResponseType = {
    id: number,
    type: string,
    amount: number,
    date: Date,
    comment: string,
    category: string
}

export type GetBalanceResponseType = {
    balance: number
}