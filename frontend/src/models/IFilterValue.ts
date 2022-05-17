
export interface IFilterValueResponse{
    count: number,
    next?: string,
    previous?: string,
    results: IFilterValue[]
}

export interface IFilterValue{
    name: string,
    id: number
}
