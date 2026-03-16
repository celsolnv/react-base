import { create } from "zustand";

type TConfirmVariant = "default" | "destructive";

export interface IConfirmOptions {
  title: string;
  message: string;
  textConfirm?: string;
  variant?: TConfirmVariant;
}

interface IConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  textConfirm?: string;
  variant: TConfirmVariant;
  resolve: ((value: boolean) => void) | null;
}

interface IConfirmStore extends IConfirmState {
  confirm: (options: IConfirmOptions) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
  reset: () => void;
}

const initialState: IConfirmState = {
  isOpen: false,
  title: "",
  message: "",
  textConfirm: "Confirmar",
  variant: "default",
  resolve: null,
};

export const useConfirmStore = create<IConfirmStore>((set, get) => ({
  ...initialState,
  confirm: ({
    title,
    message,
    textConfirm = "Confirmar",
    variant = "default",
  }: IConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        title,
        message,
        textConfirm,
        variant,
        resolve,
      });
    });
  },

  handleConfirm: () => {
    const { resolve } = get();
    if (resolve) {
      resolve(true);
    }
    get().reset();
  },

  handleCancel: () => {
    const { resolve } = get();
    if (resolve) {
      resolve(false);
    }
    get().reset();
  },

  reset: () => {
    set(initialState);
  },
}));
