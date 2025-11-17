export function userActiveStatusToLabel( status : boolean ) {
    return status? 'Activo': 'Inactivo';
} 
export function userRolesToLabel( roles : string[] ) {
    return roles.filter( rol => rol == 'admin' || rol == 'user' ).map( rol => rol == 'admin'? 'Administrador': rol ).map( rol => rol === 'user'? 'Usuario': rol);
}

export async function castUrlArrayToFileList( urls: string[] ) {
    const dataTransfer = new DataTransfer();
    for (const url of urls) {
    const finalUrl = adaptUrlSource(url);
    const response = await fetch(finalUrl);
    const blob = await response.blob();
    const filename = url.split('/').pop() || 'archivo';
    const file = new File([blob], filename, { type: blob.type });
    dataTransfer.items.add(file);
  }
  return dataTransfer.files;
}

export function adaptUrlSource ( url: string) {
    let finalURL;
    if( url.startsWith("http") )
        finalURL = url;
    else
        finalURL = "/products/" + url;
    return finalURL
}