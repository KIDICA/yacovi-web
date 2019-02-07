export const environment = {
  production: true,
  disableAuthentication: false,
  config: {
    url: 'https://yacovi-config-service.azurewebsites.net/api/GetYaCoViConfig'
  },
  azure: {
    adal: {
      tenant: '13c728e0-bb0c-4cf7-8e10-5b327279d6d9',
      clientId: '9046ce57-3082-4d8b-bec4-3b76ac73f4bc',
      redirectUri: 'https://kidica.github.io/yacovi-web/',
      endpoints: ['https://vault.azure.net']
    }
  }
};
