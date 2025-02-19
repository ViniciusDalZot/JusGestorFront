import { atom } from "recoil";

export const layoutState = atom({
  key: "layoutState",
  default: {
    layoutMode: "vertical"
  },
});
