interface DialogInterface {
   isOpen: boolean;
   dialog: HTMLElement;

   init():void;
   open : Function;
   close : Function;
}