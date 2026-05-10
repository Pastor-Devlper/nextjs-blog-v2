import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const allowedEmails = process.env.ALLOWED_EMAILS
  ? process.env.ALLOWED_EMAILS.split(',').map((e) => e.trim())
  : [];

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // 추후 추가 예시:
    // NaverProvider({ clientId: ..., clientSecret: ... }),
    // KakaoProvider({ clientId: ..., clientSecret: ... }),
    // GithubProvider({ clientId: ..., clientSecret: ... }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (allowedEmails.length === 0) return false;
      return allowedEmails.includes(user.email);
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
});
