export interface UserFront {
    id?: string;
    password?: string,
    roles?: string[];
    email?: string | null;
    image?: string | null;
    name?: string | null;
    isActive?: boolean;
    emailVerified?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}