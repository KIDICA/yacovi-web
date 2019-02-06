export const environment = {
  production: true,
  disableAuthentication: false,
  azure: {
    adal: {
      tenant: '13c728e0-bb0c-4cf7-8e10-5b327279d6d9',
      clientId: '9046ce57-3082-4d8b-bec4-3b76ac73f4bc'
    },
    vault: {
      url: 'https://yacovi-vault.vault.azure.net/secrets',
      apiVersion: '7.0'
    }
  }
};
