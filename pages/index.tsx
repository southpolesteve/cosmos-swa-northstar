import Head from "next/head";
import styles from "../styles/Home.module.css";
import { PublicClientApplication } from "@azure/msal-browser";
import { useMSALAuth } from "../hooks/useMSALAuth";
import { Persona, PrimaryButton } from "@fluentui/react";

const msalConfig = {
  auth: {
    clientId: "70058fd6-eb95-4c14-ada1-cb465574951a",
    authority:
      "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/",
  },
};

export const msal = new PublicClientApplication(msalConfig);

export default function Home() {
  const { account, isLoggedIn, login, logout } = useMSALAuth();
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {isLoggedIn ? (
          <>
            <Persona text={account.username} />
            <PrimaryButton onClick={logout}>Logout</PrimaryButton>
          </>
        ) : (
          <PrimaryButton onClick={login}>Login</PrimaryButton>
        )}
      </main>
    </div>
  );
}
