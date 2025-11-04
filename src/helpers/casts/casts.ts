

export function userActiveStatusToLabel( status : boolean ) {
    return status? 'Activo': 'Inactivo';
} 
export function userRolesToLabel( roles : string[] ) {
    return roles.filter( rol => rol == 'admin' || rol == 'user' ).map( rol => rol == 'admin'? 'Administrador': rol ).map( rol => rol === 'user'? 'Usuario': rol);
} 