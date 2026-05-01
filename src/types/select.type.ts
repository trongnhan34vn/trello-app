import type { ReactNode } from "react";


export type Option = {
    label: string | ReactNode;
    value: string | number;
    isDisabled?: boolean
}