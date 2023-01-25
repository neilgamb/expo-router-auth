import { create } from "zustand";
import { Auth } from "aws-amplify";

const useAuth = create((set) => ({
  isAuthenticated: false,
  isAuthenticating: true,
  headers: null,
  authenticate: async (authCode, animalOwnerSmsNumber) => {
    console.log("authenticating...");
    if (authCode && animalOwnerSmsNumber) {
      console.log(
        `authenticating with authCode: ${authCode} and animalOwnerSmsNumber: ${animalOwnerSmsNumber}`
      );
      try {
        const token = await getResourceToken(animalOwnerSmsNumber, authCode);
        const headers = getHeadersWithToken(token);
        set(() => ({
          headers,
          isAuthenticated: true,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        set(() => ({ isAuthenticating: false }));
      }
    } else {
      const session = await getCurrentSession();
      if (session) {
        try {
          const headers = getHeadersWithToken(
            session.getIdToken().getJwtToken()
          );
          set(() => ({
            headers,
            isAuthenticated: true,
          }));
        } catch (error) {
          console.log(error);
        } finally {
          set(() => ({ isAuthenticating: false }));
        }
      } else {
        set(() => ({ isAuthenticating: false }));
      }
    }
  },
}));

export default useAuth;

export const getCurrentSession = async () => {
  try {
    return await Auth.currentSession();
  } catch (error) {
    return null;
  }
};

export async function signIn(username) {
  try {
    return await Auth.signIn(username);
  } catch (error) {
    throw new Error(error);
  }
}

export async function answerCustomChallenge(cognitoUser, code) {
  try {
    return await Auth.sendCustomChallengeAnswer(cognitoUser, code);
  } catch (error) {
    throw new Error(error);
  }
}

export async function getResourceToken(username, code) {
  const user = await signIn(username);
  await answerCustomChallenge(user, code);
  try {
    const authenticatedUser = await Auth.currentAuthenticatedUser();
    return authenticatedUser.getSignInUserSession().getIdToken().getJwtToken();
  } catch (error) {
    throw new Error(error);
  }
}

export function getHeadersWithToken(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}
