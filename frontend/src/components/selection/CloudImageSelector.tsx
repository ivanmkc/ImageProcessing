import { getImageInfo, CloudImageInfo } from "queries";
import { useState } from "react";
import { useQuery } from "react-query";
import * as React from "react";
import clsx from "clsx";
import { ClockIcon } from "@heroicons/react/24/solid";
import Alert from "components/Alert";

const rowsPerPage = 5;

const StickyHeadTable = ({
  selectedValue,
  listInfos,
  isLoading,
  onInfoSelected,
}: {
  selectedValue?: CloudImageInfo;
  listInfos: CloudImageInfo[];
  isLoading: Boolean;
  onInfoSelected: (info: CloudImageInfo) => void;
}) => {
  const [page, setPage] = React.useState(0);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <Alert mode="loading" text="Loading images from Cloud Storage" />;
  }

  const startIndex = page * rowsPerPage;
  const endIndex = page * rowsPerPage + rowsPerPage;
  const infoSlice = listInfos.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col w-full min-w-md">
      <table className="table">
        <thead>
          <tr>
            <th key="imageId" className={clsx("px-4 py-2", "text-left")}>
              Select an image below
            </th>
          </tr>
        </thead>
        <tbody>
          {infoSlice.map((info, index) => (
            <tr
              key={index}
              className={clsx("cursor-pointer")}
              onClick={() => onInfoSelected(info)}
            >
              <td
                className={clsx(
                  "px-4 py-4",
                  "text-left",
                  selectedValue?.annotation === info.annotation &&
                    "bg-green-500",
                  "hover:bg-green-100"
                )}
              >
                {info.imageId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-end mt-3">
        <div className="pagination">
          <button
            className="btn btn-primary btn-sm"
            disabled={page === 0}
            onClick={() => handleChangePage(null, page - 1)}
          >
            Previous
          </button>
          <span className="mx-3">
            Items {startIndex} to {endIndex}
          </span>
          <button
            className="btn btn-primary btn-sm"
            disabled={page === Math.ceil(listInfos.length / rowsPerPage) - 1}
            onClick={() => handleChangePage(null, page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ({
  onImageInfoSelected,
}: {
  onImageInfoSelected: (info: CloudImageInfo) => void;
}) => {
  const [selectedImageInfo, setSelectedImageInfo] = useState<CloudImageInfo>();
  const getImageInfoQuery = useQuery<CloudImageInfo[], Error>(
    ["getImageInfo"],
    () => {
      return getImageInfo().then((infos) =>
        infos.filter((info) => info.annotation != null)
      );
    },
    { staleTime: Infinity }
  );

  return (
    <StickyHeadTable
      selectedValue={selectedImageInfo}
      listInfos={getImageInfoQuery.data ?? []}
      isLoading={getImageInfoQuery.isLoading}
      onInfoSelected={(info: CloudImageInfo) => {
        setSelectedImageInfo(info);
        onImageInfoSelected(info);
      }}
    />
  );
};
