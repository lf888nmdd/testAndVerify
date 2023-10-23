import { expect } from "chai";
import { syncTx2 } from "../src";

describe("sync tx", function () {
  it("success", async function () {
    const result = await syncTx2(
      "8af874b4e973cd59ae57059ae3f21ca88cb1edb2e964144f62ddcc7cf0be8721",
    );
    expect(result).eq(true);
  });

});
