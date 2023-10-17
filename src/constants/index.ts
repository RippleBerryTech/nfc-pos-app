import type {AppMode} from '~/types';
import type {PrinterConfig} from '~/core/ReceiptPrinter';

export enum AppEnv {
  Staging = 'Staging',
  Prod = 'Prod',
}

export const SelectedAppEnv = __DEV__ ? AppEnv.Staging : AppEnv.Prod;

export const PrinterDefaultConfigObject: PrinterConfig = {
  printerDpi: 150,
  printerWidthMM: 48,
  printerNbrCharactersPerLine: 30,
};

export const appModes: AppMode = 'expense-retour';
