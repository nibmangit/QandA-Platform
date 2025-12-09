import { useMemo } from "react";
import { MOCK_TAGS, MOCK_QUESTIONS } from "../utils/mock/mockData";

const useTagsWithCount = () => {
  const tags = useMemo(() => { 
    return MOCK_TAGS.map(tag => { 
      const count = MOCK_QUESTIONS.filter(q => q.tags.includes(tag.id)).length;
      return {
        id: tag.id,
        name: tag.name,
        count
      };
    }).filter(tag => tag.count > 0);
  }, []);

  return tags;
};

export default useTagsWithCount;