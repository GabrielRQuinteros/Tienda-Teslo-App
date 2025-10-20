

interface ServerResponse<T> {
    ok: boolean,
    status: number,
    data: T | null,
    message: string | null
}

export const createServerResponse = <T>( ok: boolean, status: number, data: T | null, message: string | null ): ServerResponse<T> => {
    return { ok, status, data, message } as ServerResponse<T>;
}