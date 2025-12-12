import { MOCK_USERS, MOCK_CATEGORIES, MOCK_TAGS } from "./mock/mockData";

export const formatScore = (num) =>
  num >= 1000 ? (num / 1000).toFixed(1) + "k" : num;

export const findUser = (id) =>MOCK_USERS.find((u) => u.id === id);

export const findCategory = (id) =>
  MOCK_CATEGORIES.find((c) => c.id === id) || { name: "General" };

export const getTagsForQuestion = (question) => {
  return MOCK_TAGS.filter((tag) => question.tags.includes(tag.id));
};
