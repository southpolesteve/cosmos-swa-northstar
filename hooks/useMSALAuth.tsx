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

  // const switchTenant = React.useCallback(
  //   async (id) => {
  //     const response = await msal.loginPopup({
  //       authority: `https://login.microsoftonline.com/${id}`,
  //     });
  //     setTenantId(response.tenantId);
  //     setAccount(response.account);
  //   },
  //   [account, tenantId]
  // );
  // React.useEffect(() => {
  //   if (account && tenantId) {
  //     Promise.all([
  //       msal.acquireTokenSilent({
  //         // There is a bug in MSALv1 that requires us to refresh the token. Their internal cache is not respecting authority
  //         forceRefresh: true,
  //         authority: `https://login.microsoftonline.com/${tenantId}`,
  //         scopes: ["https://graph.windows.net//.default"],
  //       }),
  //       msal.acquireTokenSilent({
  //         // There is a bug in MSALv1 that requires us to refresh the token. Their internal cache is not respecting authority
  //         forceRefresh: true,
  //         authority: `https://login.microsoftonline.com/${tenantId}`,
  //         scopes: ["https://management.azure.com//.default"],
  //       }),
  //     ]).then(([graphTokenResponse, armTokenResponse]) => {
  //       setGraphToken(graphTokenResponse.accessToken);
  //       setArmToken(armTokenResponse.accessToken);
  //     });
  //   }
  // }, [account, tenantId]);
  return {
    account,
    isLoggedIn,
    login,
    logout,
  };
}
