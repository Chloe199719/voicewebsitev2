import prismaClient from "@/lib/prisma/prismaClient";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
type Props = {
  params: {
    id: string;
  };
};

const fetchPost = async (id: string) => {
  try {
    // const res = await fetch(
    //   `${process.env.DB_URL}api/collections/resources/records/${id}?expand=urls,audio,images`,
    //   {
    //     next: { revalidate: parseInt(process.env.REVALIDATE!) },
    //   }
    // );
    // if (!res.ok) {
    //   console.log(res);
    // }
    // const data = await res.json();
    const data = await prismaClient.resources.findUnique({
      where: {
        id: id,
      },
      include: {
        audio: true,
      },
    });
    return data;
  } catch (e) {
    console.log(e, "Error");
  }
};

async function Page({ params }: Props) {
  const data = await fetchPost(params.id);
  return (
    <div className="flex flex-col justify-center items-center gap-6 flex-1 px-10">
      <h2 className=" text-4xl">{data?.title}</h2>
      <div className="flex flex-col gap-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]} className="test">
          {data ? data.body : ``}
        </ReactMarkdown>

        {/* {data.body?.map((e: string, i: string) => {
          return (
            <p className=" text-lg tracking-wide" key={i}>
              {e}
            </p>
          );
        })}
        {data?.expand?.urls?.map((e: any) => {
          return (
            <Link className="text-red-800" key={e.id} href={e.url}>
              {e.link_Description}
            </Link>
          );
        })}
        {data.expand?.audio?.map((e: any) => {
          return (
            <figure className="flex flex-col gap-1" key={e.id}>
              <figcaption>{e.title}</figcaption>
              <audio controls>
                <source src={e.soundurl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </figure>
          );
        })}
        {data.expand?.images?.map((e: any) => {
          return (
            <Image
              key={e.id}
              src={e.image_url}
              alt={e.alt_text}
              width={500}
              height={500}
            />
          );
        })} */}
      </div>
    </div>
  );
}
export default Page;
export const revalidate = 60;
