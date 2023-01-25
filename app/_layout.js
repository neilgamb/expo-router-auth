import { useState, useEffect } from "react";
import { Slot, useRouter, useRootNavigation } from "expo-router";
import { Amplify } from "aws-amplify";

import useAuth from "../state/auth";
import Loader from "../components/Loader";

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_ZLOgvbDEE",
    userPoolWebClientId: "44g1gnaev6suhscl9h1aur4pjf",
    authenticationFlowType: "CUSTOM_AUTH",
  },
});

export default function Root() {
  const router = useRouter();
  const { getCurrentRoute } = useRootNavigation();
  const { isAuthenticated, isAuthenticating, authenticate } = useAuth();
  const [initialRoutePath, setInitialRoutePath] = useState(null);

  useEffect(() => {
    console.log("test");
    const { name, params } = getCurrentRoute();

    setInitialRoutePath(name);

    let authCode;
    let animalOwnerSmsNumber;

    if (params && params.authCode && params.animalOwnerSmsNumber) {
      authCode = params.authCode;
      animalOwnerSmsNumber = params.animalOwnerSmsNumber;
    }

    if (name !== "error" && !isAuthenticated) {
      authenticate(authCode, animalOwnerSmsNumber);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticating && isAuthenticated) {
      router.replace(initialRoutePath);
    } else if (!isAuthenticating && !isAuthenticated) {
      router.replace("/error");
    }
  }, [isAuthenticating]);

  return (
    <>
      {isAuthenticating && <Loader />}
      <Slot />
    </>
  );
}
