export interface Auth0User {
    iss: string; // Issuer (Auth0 domain)
    sub: string; // Subject (User ID)
    aud: string[]; // Audience (API identifiers)
    iat: number; // Issued at timestamp
    exp: number; // Expiry timestamp
    scope?: string; // Scopes granted
    azp?: string; // Authorized party
}
