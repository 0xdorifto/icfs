import { Actor } from "@dfinity/agent";
import { canisterId as managementCanisterId } from "../../../declarations/management";
// import { canisterId as collectionCanisterId } from "../../../declarations/collection";
import { idlFactory as managementIdlFactory } from "../../../declarations/management/management.did.js";
// import { idlFactory as collectionIdlFactory } from "../../../declarations/collection/collection.did.js";

export const connectToPlug = async (saveActors, setAccountId) => {
  const plug = window.ic.plug;
  const network = process.env.DFX_NETWORK;

  const host =
    network === "local" ? "http://127.0.0.1:4943/" : "https://icp0.io";
  const whitelist = [managementCanisterId];
  await plug.requestConnect({ whitelist, host });

  // handle if timeout / not allowed
  if (!(await window.ic.plug.isConnected())) return;

  // if (network === "local") {
  //   plug.agent.fetchRootKey();
  // }

  const managementActor = Actor.createActor(managementIdlFactory, {
    agent: plug.agent,
    canisterId: managementCanisterId,
  });

  // const collectionActor = Actor.createActor(collectionIdlFactory, {
  //   agent: plug.agent,
  //   canisterId: collectionCanisterId,
  // });

  setAccountId(() => plug.accountId);
  saveActors(managementActor);
};
