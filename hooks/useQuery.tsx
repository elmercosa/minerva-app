import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

export default function useQuery(from: string, select: any) {
  const [data, setData] = useState([] as any);
  const [error, setError] = useState(null as any);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);
    let { data: dataFetched, error } = await supabase.from(from).select(select);
    setData(dataFetched);
    setError(error);
    setLoading(false);
    return { dataFetched, error };
  }, [from, select, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading };
}
