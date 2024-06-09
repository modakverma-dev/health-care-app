import { QRCodeSVG } from "qrcode.react";

const DashboardPageContent = ({
  avalableSlotsList,
}: {
  avalableSlotsList: any;
}) => {
  return (
    <div className="py-20 overflow-auto min-h-screen w-full h-full flex justify-center ">
      <div className="w-[70%] h-auto flex flex-col gap-4">
        <h1 className="text-xl font-semibold">List of Appointments:</h1>
        {avalableSlotsList?.map((data: any, index: number) => {
          let showDetails = index === 0;
          return (
            <div
              className="w-full rounded-md flex justify-between border-[1px] p-3 shadow-md"
              key={index}
            >
              <div className="flex-1 mr-5">
                <h1>Name: {data?.username}</h1>
                <h1>Age: 19</h1>
                <p className="font-light text-slate-600">
                  <span className="text-black font-bold"> Problem:</span> Lorem
                  ipsum dolor sit amet, consectetur adipisicing elit. Alias
                  distinctio quibusdam ducimus voluptatibus fugit, veniam,
                  dolore mollitia delectus, enim amet minima architecto ipsa
                  molestiae? Est adipisci architecto velit id ratione iure
                  recusandae officia.
                </p>
                {showDetails && (
                  <div className="gap-2 flex">
                    <button className="bg-blue-200 px-4 py-1 rounded-full my-2">
                      Generate report
                    </button>
                    <button className="bg-red-200 px-4 py-1 rounded-full my-2">
                      Next {">"}
                    </button>
                  </div>
                )}
              </div>
              {showDetails && (
                <QRCodeSVG width={250} height={250} value={data?.tokenId} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPageContent;
