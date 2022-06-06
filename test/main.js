require("./BufferTools");
require("./AesCmac");

const AesCmac = require("../lib/AesCmac.js").AesCmac;
const assert = require("assert");

describe("index (module entry point)", () => {
  describe("aesCmac(message)", () => {
    it("performs the AES-CMAC algorithm", async () => {
      const key = Buffer.from("2b7e151628aed2a6abf7158809cf4f3c", "hex");
      const message = Buffer.from("6bc1bee22e409f96e93d7e117393172a", "hex");
      const result = await new AesCmac(key).calculate(message);
      assert.strictEqual(
        result.toString("hex"),
        "070a16b46b4d4144f79bdd9dd04a287c"
      );
    });

    it("returns a buffer as the response", async () => {
      const key = Buffer.from("k3Men*p/2.3j4abB");
      const message = Buffer.from("this|is|a|test|message");
      const result = await new AesCmac(key).calculate(message);
      assert.strictEqual(
        result.toString("hex"),
        "0125c538f8be7c4eea370f992a4ffdcb"
      );
    });

    it("throws an error if the key length is invalid", () => {
      const expected = "Key size must be 128, 192, or 256 bits.";
      assertAesCmacError(
        Buffer.from("key"),
        Buffer.from("some message"),
        expected
      );
    });

    it("throws an error if the key is not a Buffer", async () => {
      const expected = "The key must be provided as a Buffer.";
      assert.throws(
        () => new AesCmac(10),
        (error) => {
          assert.equal(error.message, expected);
          return true;
        }
      );
      assert.throws(
        () => new AesCmac(null),
        (error) => {
          assert.equal(error.message, expected);
          return true;
        }
      );
    });

    it("throws an error if the message is not a Buffer", async () => {
      const expected = "The message must be provided as a Buffer.";
      await assertAesCmacError(Buffer.from("averysecretvalue"), null, expected);
      await assertAesCmacError(Buffer.from("averysecretvalue"), {}, expected);
    });

    async function assertAesCmacError(key, message, expectedErrorMessage) {
      await assert.rejects(
        new AesCmac(key).calculate(message),

        (error) => {
          assert("message" in error);
          assert.strictEqual(error.message, expectedErrorMessage);
          return true;
        }
      );
    }
  });
});
