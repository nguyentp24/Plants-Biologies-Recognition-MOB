import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export const googleAuthConfig = {
  expoClientId: '974321576275-et7pfkc8m3a57vmi18ljmr7t4jfa6ec0.apps.googleusercontent.com',
  androidClientId: '974321576275-l1nd89u0mii76v0ukufofgob8d4j08f5.apps.googleusercontent.com',
  iosClientId: '974321576275-a9pepgnt16r9uarmlglmhp0gskqin5q0.apps.googleusercontent.com',
  webClientId: '974321576275-3s0ev7qs9q8fju3j1954lmlnrq3g3t3f.apps.googleusercontent.com',
  redirectUri: AuthSession.makeRedirectUri({
    scheme: 'helloworldapp', // 👈 Quan trọng khi dùng EAS
  }),
};
