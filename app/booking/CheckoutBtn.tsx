import pb from "@/lib/pocketbase";

type Props = {
  date: Date;
  selHour: string;
};
function CheckoutBtn({ date, selHour }: Props) {
  const onClick = async function () {
    try {
      const test = await fetch("/api/checkout_sessions", {
        method: `POST`,
        body: JSON.stringify({
          clientID: pb.authStore.model?.id,
          clientEmail: pb.authStore.model?.email,
          productID: `ynd2yl24qv7jnze`,
          bookedHour: selHour,
          time: date,
        }),
      });
      const data = await test.json();
      window.location = data.url;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {" "}
      {pb.authStore.isValid ? (
        <button
          disabled={selHour === ""}
          className="py-4 px-10 rounded-xl bg-slate-400 disabled:bg-red-200"
          onClick={onClick}
        >
          Private Book
        </button>
      ) : (
        <p className="text-red-400">Login</p>
      )}
    </>
  );
}
export default CheckoutBtn;
