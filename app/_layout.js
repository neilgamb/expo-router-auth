import { useState, useEffect } from "react";
import { Slot, useRouter, useRootNavigation } from "expo-router";

export default function Root() {
  const router = useRouter();
  const { getCurrentRoute } = useRootNavigation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialRoutePath, setInitialRoutePath] = useState(null);
  const [initialRouteParams, setInitialRouteParams] = useState(null);

  useEffect(() => {
    if (initialRouteParams && !isEmptyObj(initialRouteParams)) {
      console.log("authenticate with params:");
      console.log(initialRouteParams);

      setTimeout(() => {
        setIsAuthenticated(true);
      }, 3000);
    }
  }, [initialRouteParams]);

  useEffect(() => {
    const initialRoute = getCurrentRoute();
    setInitialRoutePath(initialRoute.name);
    setInitialRouteParams(initialRoute.params);

    if (!initialRoute.params) {
      router.replace("/error");
    } else if (!isAuthenticated) {
      router.replace("/loading");
    } else {
      router.replace(initialRoutePath);
    }
  }, [isAuthenticated]);

  return <Slot />;
}

function isEmptyObj(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
