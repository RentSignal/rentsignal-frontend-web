type ToastMessageProps = {
    message: string;
};

export default function ToastMessage({ message }: ToastMessageProps) {
    console.log("ToastMessage message:", message);
    if (!message) return null;

    return (
        <div
            className="
        fixed left-1/2 top-[16px] z-[9999]
        flex items-center gap-3
        w-[258px] px-4 py-3
        -translate-x-1/2
        rounded-md bg-slate-700
        text-sm font-medium text-white
        shadow-lg
      "
        >
            <span
                className="
          flex h-5 w-5 shrink-0 items-center justify-center
          rounded-full bg-yellow-400
          text-xs font-bold text-slate-700
        "
            >
                !
            </span>

            <span>{message}</span>
        </div>
    );
}