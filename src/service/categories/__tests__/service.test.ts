import { CategoriesService } from "@services";

describe(`CategoriesService methods`, () => {
  describe(`Find Category`, () => {
    it(`Finds one category from the db`, async () => {
      const testCategoryCode = "employment_labour";

      const testCategoryResult = await new CategoriesService().findOneCategory(
        testCategoryCode,
      );

      // Test bill minus the fields id and created_at (which will differ between creations)
      const testCategory = {
        name: "Employment and labour",
        class_code: "employment_labour",
      };

      delete testCategoryResult.id;
      delete testCategoryResult.created_at;
      expect(testCategoryResult).toEqual(testCategory);
      expect(testCategoryResult.class_code).toEqual(testCategoryCode);
    });
  });
});
