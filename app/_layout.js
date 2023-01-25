import { useState, useEffect } from "react";
import { Slot, useRouter, useRootNavigation } from "expo-router";
import { Amplify } from "aws-amplify";

import useAuth from "../state/auth";

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
  const [initialRouteParams, setInitialRouteParams] = useState(null);

  useEffect(() => {
    let authCode;
    let animalOwnerSmsNumber;

    if (
      getCurrentRoute().name !== "loading" &&
      initialRouteParams &&
      initialRouteParams.authCode &&
      initialRouteParams.animalOwnerSmsNumber
    ) {
      authCode = initialRouteParams.authCode;
      animalOwnerSmsNumber = initialRouteParams.animalOwnerSmsNumber;
    }

    authenticate(authCode, animalOwnerSmsNumber);
  }, [initialRouteParams]);

  useEffect(() => {
    const initialRoute = getCurrentRoute();
    setInitialRoutePath(initialRoute.name);
    setInitialRouteParams(initialRoute.params);

    if (isAuthenticating) {
      router.replace("/loading");
    } else if (!isAuthenticating && isAuthenticated) {
      router.replace(initialRoutePath);
    } else {
      router.replace("/error");
    }
  }, [isAuthenticating]);

  return <Slot />;
}
