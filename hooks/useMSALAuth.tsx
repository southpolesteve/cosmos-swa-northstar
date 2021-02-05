import { useState, useCallback } from "react";
import { PublicClientApplication, AccountInfo } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "70058fd6-eb95-4c14-ada1-cb465574951a",
    authority:
      "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/",
  },
};

export const msal = new PublicClientApplication(msalConfig);

export function useMSALAuth() {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [account, setAccount] = useState<AccountInfo>();

  const login = useCallback(async () => {
    const response = await msal.loginPopup();
    setAccount(response.account);
    setLoggedIn(true);
    localStorage.setItem("cachedTenantId", response.tenantId);
  }, []);

  const logout = useCallback(() => {
    setLoggedIn(false);
    msal.logout();
  }, []);

  return {
    account,
    isLoggedIn,
    login,
    logout,
  };
}
