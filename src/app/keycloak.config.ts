import {
    provideKeycloak,
    withAutoRefreshToken,
    AutoRefreshTokenService,
    UserActivityService
} from 'keycloak-angular';

export const provideKeycloakAngular = () =>
    provideKeycloak({
        config: {
            url: 'http://localhost:8080',
            realm: 'LKS',
            clientId: 'chatlks-angular-app'
        },
        initOptions: {
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            redirectUri: window.location.origin + '/'
        },
        features: [
            withAutoRefreshToken({
                onInactivityTimeout: 'logout',
                sessionTimeout: 60000
            })
        ],
        providers: [
            AutoRefreshTokenService,
            UserActivityService,
        ]
    });