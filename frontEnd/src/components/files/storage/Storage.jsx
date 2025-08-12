import styles from "./Storage.module.css";
import iconCloudFiles from "../../../assets/img/cloudFiles.png";
import gifLoader from "../../../assets/img/loader.gif";
import iconErrorStorage from "../../../assets/img/errorStorage.png";
import { useState } from "react";
import { useEffect } from "react";

export const Storage = () => {
  const [storageUsed, setStorageUsed] = useState();
  const [percentajeUsed, setPercentajeUsed] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchGetStorageUsedByUser = async () => {
    setLoading(true);

    try {
      const response = await fetch("api/storage/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) location.href = urlFront + "login";
        else throw new Error(result.messageError);
      }

      if (result) setStorageUsed(result.storageUsed);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetStorageUsedByUser();
  }, []);

  useEffect(() => {
    if (storageUsed) {
      widthBarUsed();
    }
  }, [storageUsed]);

  const widthBarUsed = () => {
    setPercentajeUsed(
      Math.ceil((storageUsed.bytesUsed * 100) / storageUsed.limitSize)
    );
  };

  const convertToMeasureByte = (bytesUsed) => {
    let bytesUsedConverted = 0;
    let measure = "Bytes";

    switch (true) {
      case bytesUsed >= 1000 && bytesUsed < Math.pow(10, 6):
        bytesUsedConverted = bytesUsed / 1000;
        measure = "KB";
        break;
      case bytesUsed >= Math.pow(10, 6) && bytesUsed < Math.pow(10, 9):
        bytesUsedConverted = bytesUsed / Math.pow(10, 6);
        measure = "MB";
        break;
      case bytesUsed >= Math.pow(10, 9):
        bytesUsedConverted = bytesUsed / Math.pow(10, 9);
        measure = "GB";
        break;
    }
 
    return {
      bytesUsedConverted: bytesUsedConverted.toFixed(1),
      measure: measure
    };
  };

  return (
    <div className={styles.containStorageUsed}>
      <div className={styles.title}>
        <img src={iconCloudFiles}></img>
        <span>Storage</span>
      </div>

      {loading ? (
        <div className={styles.loader}>
          <span>loading</span>
          <img src={gifLoader}></img>
        </div>
      ) : !storageUsed ? (
        <div className={styles.noDataStorage}>
          <img src={iconErrorStorage}></img>
          <span>no data</span>
        </div>
      ) : (
        <>
          <div className={styles.barStorageUsed}>
            <div
              style={{ width: percentajeUsed + "%" }}
              className={styles.sizeStorageUsed}
            ></div>
          </div>
          {storageUsed && (
            <span>
              {convertToMeasureByte(storageUsed.bytesUsed).bytesUsedConverted +
                " " +
                convertToMeasureByte(storageUsed.bytesUsed).measure}{" "}
              used of {storageUsed.limitSize / Math.pow(10, 9)} GB
            </span>
          )}
        </>
      )}
    </div>
  );
};
