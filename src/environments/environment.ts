interface Environment {
  production: boolean;
  apiURLBase: string;
  clientId: string;
  clientSecret: string;
  obterTokenUrl: string;
}

export const environment: Environment = {
  production: false,
  // apiURLBase: 'http://localhost:8087',
  apiURLBase: 'https://backend-app-w53w.onrender.com',
  clientId: 'lm-app',
  clientSecret: '@2026',
  obterTokenUrl: '/oauth/token',
};
