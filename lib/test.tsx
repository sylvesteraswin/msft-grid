import styles from "./style.module.css";
import { useState, useEffect } from "react";

export const Images = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api").then((r) => r.json());
        setData(res);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchImage();
  }, []);

  return (
    <div className={styles.grid}>
      {loading && <>Loading...</>}
      {!loading && error && <>Error...</>}
      {!loading &&
        data.length > 0 &&
        data.map(({ url }, index) => {
          return (
            <div key={index}>
              <img src={url} alt={`Image ${index}`} />
            </div>
          );
        })}
    </div>
  );
};
